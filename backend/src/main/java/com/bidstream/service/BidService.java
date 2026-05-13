package com.bidstream.service;

import com.bidstream.model.AuctionItem;
import com.bidstream.model.Bid;
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

@Service
public class BidService {

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Bid placeBid(Long auctionId, String username, Double amount) {
        User bidder = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Use pessimistic locking to prevent double bidding
        AuctionItem auctionItem = auctionItemRepository.findByIdWithPessimisticLock(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        if (auctionItem.getStatus() != Status.ACTIVE) {
            throw new RuntimeException("Auction is not active");
        }

        if (LocalDateTime.now().isAfter(auctionItem.getEndTime())) {
            throw new RuntimeException("Auction has ended");
        }

        if (amount <= auctionItem.getCurrentHighestBid() || amount < auctionItem.getStartingPrice()) {
            throw new RuntimeException("Bid amount must be higher than current bid and starting price");
        }

        // Anti-Sniper: bid in final 60s extends auction by 2 minutes
        if (auctionItem.getEndTime().minusSeconds(60).isBefore(LocalDateTime.now())) {
            auctionItem.setEndTime(auctionItem.getEndTime().plusMinutes(2));
        }

        // Update auction item
        auctionItem.setCurrentHighestBid(amount);
        auctionItemRepository.save(auctionItem);

        // Record bid
        Bid bid = Bid.builder()
                .amount(amount)
                .bidTime(LocalDateTime.now())
                .auctionItem(auctionItem)
                .bidder(bidder)
                .build();
        bidRepository.save(bid);

        // Broadcast to specific auction topic
        String destination = "/topic/auction/" + auctionId;
        String payload = String.format("{\"currentHighestBid\": %f, \"bidderUsername\": \"%s\", \"newEndTime\": \"%s\"}",
                amount, username, auctionItem.getEndTime().toString());
        messagingTemplate.convertAndSend(destination, payload);

        return bid;
    }
}
