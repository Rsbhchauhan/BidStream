package com.bidstream.controller;

import com.bidstream.model.Bid;
import com.bidstream.service.BidService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bidstream.repository.BidRepository;
import java.util.List;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    @Autowired
    private BidRepository bidRepository;

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('BUYER') or hasRole('ADMIN')")
    public ResponseEntity<?> placeBid(@RequestBody BidRequest request, Authentication authentication) {
        try {
            Bid bid = bidService.placeBid(request.getAuctionId(), authentication.getName(), request.getAmount());
            return ResponseEntity.ok(bid);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<List<BidResponse>> getBidsForAuction(@PathVariable Long auctionId) {
        List<BidResponse> responses = bidRepository.findByAuctionItemIdOrderByBidTimeDesc(auctionId)
                .stream()
                .map(b -> new BidResponse(b.getAmount(), b.getBidder().getUsername()))
                .toList();
        return ResponseEntity.ok(responses);
    }
}

@Data
class BidResponse {
    private Double amount;
    private String username;

    public BidResponse(Double amount, String username) {
        this.amount = amount;
        this.username = username;
    }
}

@Data
class BidRequest {
    private Long auctionId;
    private Double amount;
}
