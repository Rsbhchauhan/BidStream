package com.bidstream.service;

import com.bidstream.model.*;
import com.bidstream.repository.AuctionItemRepository;
import com.bidstream.repository.BidRepository;
import com.bidstream.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuctionScheduler {

    private static final Logger logger = LoggerFactory.getLogger(AuctionScheduler.class);

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    @Autowired
    private BidRepository bidRepository;


    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate = 5000)
    @Transactional
    public void scheduleAuctionSettlement() {
        logger.info("Running automated settlement scheduler...");

        List<AuctionItem> endedAuctions = auctionItemRepository.findByStatusAndEndTimeBefore(Status.ACTIVE, LocalDateTime.now());

        for (AuctionItem auction : endedAuctions) {
            auction.setStatus(Status.CLOSED);
            
            // Find highest bid
            List<Bid> bids = bidRepository.findByAuctionItemIdOrderByBidTimeDesc(auction.getId());
            
            if (!bids.isEmpty()) {
                Bid winningBid = bids.get(0);
                User winner = winningBid.getBidder();
                User seller = auction.getSeller();
                Double amount = winningBid.getAmount();

                // Ensure reserve price is met
                if (auction.getReservePrice() == null || amount >= auction.getReservePrice()) {
                    // Change status to pending payment
                    auction.setStatus(Status.PENDING_PAYMENT);

                    // Broadcast to auction topic so UI updates instantly
                    String destination = "/topic/auction/" + auction.getId();
                    String payload = String.format("{\"status\": \"%s\"}", Status.PENDING_PAYMENT.name());
                    messagingTemplate.convertAndSend(destination, payload);

                    // Notifications
                    createAndSendNotification(winner, "You Won! Please pay $" + amount + " for: " + auction.getTitle());
                    createAndSendNotification(seller, "Item Sold! Awaiting payment of $" + amount + " for your item '" + auction.getTitle() + "'");
                } else {
                    createAndSendNotification(seller, "Item Not Sold. Reserve price not met for: " + auction.getTitle());
                }
            } else {
                createAndSendNotification(auction.getSeller(), "Auction ended with no bids for: " + auction.getTitle());
            }

            auctionItemRepository.save(auction);
        }

        // Activate UPCOMING auctions whose start time has arrived
        List<AuctionItem> upcomingReady = auctionItemRepository.findByStatusAndStartTimeBefore(Status.UPCOMING, LocalDateTime.now());
        for (AuctionItem auction : upcomingReady) {
            auction.setStatus(Status.ACTIVE);
            auctionItemRepository.save(auction);
            logger.info("Activated auction: {} (ID: {})", auction.getTitle(), auction.getId());

            String destination = "/topic/auction/" + auction.getId();
            String payload = String.format("{\"status\": \"%s\"}", Status.ACTIVE.name());
            messagingTemplate.convertAndSend(destination, payload);
        }
    }

    private void createAndSendNotification(User user, String message) {
        Notification notification = Notification.builder()
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        notificationRepository.save(notification);

        // Optional: Real-time notification over websocket for the specific user
        messagingTemplate.convertAndSendToUser(user.getUsername(), "/queue/notifications", notification);
    }
}
