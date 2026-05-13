import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class TriggerNotification {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://ep-falling-thunder-aoe7qztf-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
        String user = "neondb_owner";
        String password = "npg_EGWhel8v6IfR";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Updating auction to end now...");
            // Set end_time to 1 minute ago for the mock Rolex auction in the 'bidstream' schema
            int rows = stmt.executeUpdate("UPDATE bidstream.auction_items SET end_time = CURRENT_TIMESTAMP - INTERVAL '1 minute' WHERE title = 'Vintage Rolex Daytona'");
            System.out.println("Rows updated: " + rows);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
