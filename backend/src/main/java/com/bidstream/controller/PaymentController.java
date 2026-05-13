package com.bidstream.controller;

import com.bidstream.dto.MessageResponse;
import com.bidstream.model.AuctionItem;
import com.bidstream.model.Bid;
import com.bidstream.model.Status;
import com.bidstream.repository.AuctionItemRepository;
import com.bidstream.repository.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    @Autowired
    private BidRepository bidRepository;

    @PostMapping("/pay/{auctionId}")
    public ResponseEntity<?> processPayment(@PathVariable Long auctionId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        AuctionItem auction = auctionItemRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        if (auction.getStatus() != Status.PENDING_PAYMENT) {
            return ResponseEntity.badRequest().body(new MessageResponse("Auction is not pending payment."));
        }

        // Verify the user is the winner
        List<Bid> bids = bidRepository.findByAuctionItemIdOrderByBidTimeDesc(auctionId);
        if (bids.isEmpty() || !bids.get(0).getBidder().getUsername().equals(username)) {
            return ResponseEntity.status(403).body(new MessageResponse("Only the winner can pay for this auction."));
        }

        // Mock payment processing (e.g., Stripe logic would go here)
        // Assume payment is successful

        auction.setStatus(Status.PAID);
        auctionItemRepository.save(auction);

        return ResponseEntity.ok(new MessageResponse("Payment successful!"));
    }
}
