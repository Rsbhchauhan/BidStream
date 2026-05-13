package com.bidstream.repository;

import com.bidstream.model.AuctionItem;
import com.bidstream.model.Status;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionItemRepository extends JpaRepository<AuctionItem, Long> {

    List<AuctionItem> findByStatus(Status status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM AuctionItem a WHERE a.id = :id")
    Optional<AuctionItem> findByIdWithPessimisticLock(@Param("id") Long id);

    List<AuctionItem> findByStatusAndEndTimeBefore(Status status, LocalDateTime time);

    @Query("SELECT DISTINCT a FROM AuctionItem a JOIN Bid b ON b.auctionItem = a WHERE a.status = :status AND b.bidder.username = :username AND b.amount = a.currentHighestBid")
    List<AuctionItem> findPendingPaymentsForUser(@Param("username") String username, @Param("status") Status status);

    List<AuctionItem> findBySeller_UsernameOrderByEndTimeDesc(String username);

    List<AuctionItem> findByStatusAndStartTimeBefore(Status status, LocalDateTime time);
}
