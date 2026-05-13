package com.bidstream.controller;

import com.bidstream.dto.MessageResponse;

import com.bidstream.model.User;
import com.bidstream.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import com.bidstream.model.AuctionItem;
import com.bidstream.model.Bid;
import com.bidstream.model.Status;
import com.bidstream.repository.AuctionItemRepository;
import com.bidstream.repository.BidRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(user);
    }

    @PutMapping("/username")
    public ResponseEntity<?> updateUsername(@RequestBody Map<String, String> request) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        String newUsername = request.get("newUsername");

        if (userRepository.existsByUsername(newUsername)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        User user = userRepository.findByUsername(currentUsername).orElseThrow();
        user.setUsername(newUsername);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Username updated successfully!"));
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        User user = userRepository.findByUsername(currentUsername).orElseThrow();

        if (currentPassword == null || !passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Incorrect current password!"));
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password updated successfully!"));
    }

    @GetMapping("/history/auctions")
    public ResponseEntity<List<Map<String, Object>>> getCreatedAuctions() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<AuctionItem> items = auctionItemRepository.findBySeller_UsernameOrderByEndTimeDesc(username);
        List<Map<String, Object>> response = items.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("title", a.getTitle());
            map.put("description", a.getDescription());
            map.put("imageUrl", a.getImageUrl());
            map.put("startingPrice", a.getStartingPrice());
            map.put("currentHighestBid", a.getCurrentHighestBid());
            map.put("startTime", a.getStartTime());
            map.put("endTime", a.getEndTime());
            map.put("status", a.getStatus().name());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/bids")
    public ResponseEntity<List<Map<String, Object>>> getPastBids() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Bid> bids = bidRepository.findByBidderUsernameOrderByBidTimeDesc(username);
        
        List<Map<String, Object>> response = bids.stream().map(bid -> {
            Map<String, Object> map = new HashMap<>();
            map.put("bidAmount", bid.getAmount());
            map.put("bidTime", bid.getBidTime());
            map.put("auctionId", bid.getAuctionItem().getId());
            map.put("auctionTitle", bid.getAuctionItem().getTitle());
            map.put("auctionStatus", bid.getAuctionItem().getStatus());
            map.put("auctionHighestBid", bid.getAuctionItem().getCurrentHighestBid());
            return map;
        }).toList();
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/payments")
    public ResponseEntity<List<Map<String, Object>>> getPaymentHistory() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<AuctionItem> items = auctionItemRepository.findPendingPaymentsForUser(username, Status.PAID);
        List<Map<String, Object>> response = items.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("title", a.getTitle());
            map.put("imageUrl", a.getImageUrl());
            map.put("currentHighestBid", a.getCurrentHighestBid());
            map.put("endTime", a.getEndTime());
            map.put("status", a.getStatus().name());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/wins")
    public ResponseEntity<List<Map<String, Object>>> getMyWins() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        // Items where user was highest bidder and auction is PAID or PENDING_PAYMENT
        List<AuctionItem> paidWins = auctionItemRepository.findPendingPaymentsForUser(username, Status.PAID);
        List<AuctionItem> pendingWins = auctionItemRepository.findPendingPaymentsForUser(username, Status.PENDING_PAYMENT);

        List<Map<String, Object>> wins = new java.util.ArrayList<>();
        for (AuctionItem item : paidWins) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", item.getId());
            map.put("title", item.getTitle());
            map.put("imageUrl", item.getImageUrl());
            map.put("winAmount", item.getCurrentHighestBid());
            map.put("status", "PAID");
            map.put("endTime", item.getEndTime());
            wins.add(map);
        }
        for (AuctionItem item : pendingWins) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", item.getId());
            map.put("title", item.getTitle());
            map.put("imageUrl", item.getImageUrl());
            map.put("winAmount", item.getCurrentHighestBid());
            map.put("status", "PENDING_PAYMENT");
            map.put("endTime", item.getEndTime());
            wins.add(map);
        }
        return ResponseEntity.ok(wins);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getSellerDashboard() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<AuctionItem> allListings = auctionItemRepository.findBySeller_UsernameOrderByEndTimeDesc(username);

        long activeListings = allListings.stream().filter(a -> a.getStatus() == Status.ACTIVE).count();
        long soldItems = allListings.stream().filter(a -> a.getStatus() == Status.PAID).count();
        long unsoldItems = allListings.stream().filter(a -> a.getStatus() == Status.CLOSED).count();
        long pendingPayment = allListings.stream().filter(a -> a.getStatus() == Status.PENDING_PAYMENT).count();
        double totalRevenue = allListings.stream()
                .filter(a -> a.getStatus() == Status.PAID)
                .mapToDouble(a -> a.getCurrentHighestBid() != null ? a.getCurrentHighestBid() : 0.0)
                .sum();

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalListings", allListings.size());
        dashboard.put("activeListings", activeListings);
        dashboard.put("soldItems", soldItems);
        dashboard.put("unsoldItems", unsoldItems);
        dashboard.put("pendingPayment", pendingPayment);
        dashboard.put("totalRevenue", totalRevenue);

        // Include listing details
        List<Map<String, Object>> listings = allListings.stream().map(a -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", a.getId());
            m.put("title", a.getTitle());
            m.put("status", a.getStatus().name());
            m.put("startingPrice", a.getStartingPrice());
            m.put("currentHighestBid", a.getCurrentHighestBid());
            m.put("endTime", a.getEndTime());
            m.put("imageUrl", a.getImageUrl());
            return m;
        }).collect(Collectors.toList());
        dashboard.put("listings", listings);

        return ResponseEntity.ok(dashboard);
    }
}
