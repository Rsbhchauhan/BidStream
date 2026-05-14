package com.bidstream.controller;

import com.bidstream.model.AuctionItem;
import com.bidstream.service.AuctionService;
import com.bidstream.service.ImageStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private ImageStorageService imageStorageService;

    @PostMapping
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<AuctionItem> createAuction(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("startingPrice") Double startingPrice,
            @RequestParam(value = "reservePrice", required = false) Double reservePrice,
            @RequestParam("startTime") String startTimeStr,
            @RequestParam("endTime") String endTimeStr,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication) {

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = imageStorageService.uploadImage(image);
        }

        java.time.LocalDateTime startTime = java.time.OffsetDateTime.parse(startTimeStr)
                .atZoneSameInstant(java.time.ZoneId.systemDefault()).toLocalDateTime();
        java.time.LocalDateTime endTime = java.time.OffsetDateTime.parse(endTimeStr)
                .atZoneSameInstant(java.time.ZoneId.systemDefault()).toLocalDateTime();

        AuctionItem item = auctionService.createAuction(
                title, description, startingPrice, reservePrice, startTime, endTime, authentication.getName(), imageUrl);

        return ResponseEntity.ok(item);
    }

    @GetMapping("/active")
    public ResponseEntity<List<AuctionItem>> getActiveAuctions() {
        return ResponseEntity.ok(auctionService.getActiveAuctions());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<AuctionItem>> getUpcomingAuctions() {
        return ResponseEntity.ok(auctionService.getUpcomingAuctions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionItem> getAuction(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.getAuctionById(id));
    }

    @GetMapping("/pending-payments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AuctionItem>> getPendingPayments(Authentication authentication) {
        return ResponseEntity.ok(auctionService.getPendingPaymentsForUser(authentication.getName()));
    }

    @PostMapping("/{id}/reset")
    public ResponseEntity<?> resetAuction(@PathVariable Long id) {
        auctionService.resetAuction(id);
        return ResponseEntity.ok().body("Auction reset to 1 minute.");
    }

}
