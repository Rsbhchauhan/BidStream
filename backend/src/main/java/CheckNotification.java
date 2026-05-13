import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CheckNotification {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://ep-falling-thunder-aoe7qztf-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
        String user = "neondb_owner";
        String password = "npg_EGWhel8v6IfR";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Checking for recent notifications...");
            ResultSet rs = stmt.executeQuery("SELECT message, created_at FROM bidstream.notifications ORDER BY created_at DESC LIMIT 5");
            
            while (rs.next()) {
                System.out.println("Notification: " + rs.getString("message") + " at " + rs.getTimestamp("created_at"));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
