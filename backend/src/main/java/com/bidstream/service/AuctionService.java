package com.bidstream.service;

import com.bidstream.model.AuctionItem;
import com.bidstream.model.Status;
import com.bidstream.model.User;
import com.bidstream.repository.AuctionItemRepository;
import com.bidstream.repository.BidRepository;
import com.bidstream.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuctionService {

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public AuctionItem createAuction(String title, String description, Double startingPrice, Double reservePrice,
                                     LocalDateTime startTime, LocalDateTime endTime, String sellerUsername, String imageUrl) {
        User seller = userRepository.findByUsername(sellerUsername)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        AuctionItem auctionItem = AuctionItem.builder()
                .title(title)
                .description(description)
                .startingPrice(startingPrice)
                .currentHighestBid(0.0)
                .reservePrice(reservePrice)
                .startTime(startTime)
                .endTime(endTime)
                .status(Status.UPCOMING)
                .seller(seller)
                .imageUrl(imageUrl)
                .build();

        // If startTime is in the past or now, set to ACTIVE
        if (!startTime.isAfter(LocalDateTime.now())) {
            auctionItem.setStatus(Status.ACTIVE);
        }

        return auctionItemRepository.save(auctionItem);
    }

    public List<AuctionItem> getActiveAuctions() {
        return auctionItemRepository.findByStatus(Status.ACTIVE);
    }

    public List<AuctionItem> getUpcomingAuctions() {
        return auctionItemRepository.findByStatus(Status.UPCOMING);
    }

    public AuctionItem getAuctionById(Long id) {
        return auctionItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Auction not found"));
    }

    public void cancelAuction(Long id) {
        AuctionItem auctionItem = getAuctionById(id);
        auctionItem.setStatus(Status.CANCELLED);
        auctionItemRepository.save(auctionItem);
    }

    public List<AuctionItem> getPendingPaymentsForUser(String username) {
        return auctionItemRepository.findPendingPaymentsForUser(username, Status.PENDING_PAYMENT);
    }

    @Transactional
    public void resetAuction(Long id) {
        AuctionItem auction = getAuctionById(id);
        
        // Delete all bids
        bidRepository.deleteByAuctionItemId(id);
        
        // Reset properties
        auction.setCurrentHighestBid(auction.getStartingPrice());
        auction.setStatus(Status.ACTIVE);
        auction.setEndTime(java.time.LocalDateTime.now().plusMinutes(1));
        
        auctionItemRepository.save(auction);
        
        // Broadcast reset to UI
        String destination = "/topic/auction/" + id;
        String payload = String.format("{\"status\": \"%s\", \"currentHighestBid\": %f, \"bidderUsername\": \"\", \"newEndTime\": \"%s\"}", 
            Status.ACTIVE.name(), auction.getStartingPrice(), auction.getEndTime().toString());
        messagingTemplate.convertAndSend(destination, payload);
    }
    @Transactional
    public void deleteAll() {
        bidRepository.deleteAll();
        auctionItemRepository.deleteAll();
    }
}
