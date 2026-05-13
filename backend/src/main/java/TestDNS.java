import java.net.InetAddress;

public class TestDNS {
    public static void main(String[] args) {
        try {
            String host = "ep-falling-thunder-aoe7qztf-pooler.c-2.ap-southeast-1.aws.neon.tech";
            System.out.println("Resolving " + host + "...");
            InetAddress address = InetAddress.getByName(host);
            System.out.println("IP Address: " + address.getHostAddress());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
