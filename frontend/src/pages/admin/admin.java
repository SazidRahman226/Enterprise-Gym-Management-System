import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

/**
 * EnterpriseResourcePlanner
 * * This class represents a dummy implementation of a large-scale enterprise system.
 * It is designed to demonstrate a file with approximately 500 lines of code.
 * * Functionalities included:
 * - User management
 * - Inventory tracking
 * - Financial logging
 * - System health monitoring
 * * @version 1.0.0
 * @since 2023-10-27
 */
public class EnterpriseResourcePlanner {

    // =================================================================================================
    // SECTION: CONSTANTS & CONFIGURATION
    // =================================================================================================
    
    private static final String SYSTEM_NAME = "Global ERP System v1.0";
    private static final int MAX_USERS = 10000;
    private static final double TAX_RATE = 0.15;
    private static final int TIMEOUT_MS = 5000;
    private static final String DEFAULT_CURRENCY = "USD";
    private static final boolean DEBUG_MODE = true;

    // Error Codes
    public static final int ERR_USER_NOT_FOUND = 404;
    public static final int ERR_SYSTEM_FAILURE = 500;
    public static final int ERR_ACCESS_DENIED = 403;

    // =================================================================================================
    // SECTION: INSTANCE VARIABLES
    // =================================================================================================

    private String systemId;
    private boolean isActive;
    private long uptime;
    private Date lastMaintenanceDate;
    
    // User Data
    private List<String> userList;
    private Map<String, String> userRoles;
    private Map<String, Date> lastLoginMap;

    // Financial Data
    private double totalRevenue;
    private double totalExpenses;
    private List<Double> transactionHistory;

    // Inventory Data
    private Map<String, Integer> inventoryCounts;
    private List<String> outOfStockItems;

    // System Health
    private int errorCount;
    private int warningCount;
    private List<String> systemLogs;

    // =================================================================================================
    // SECTION: CONSTRUCTORS
    // =================================================================================================

    /**
     * Default Constructor
     * Initializes the system with default values.
     */
    public EnterpriseResourcePlanner() {
        this.systemId = UUID.randomUUID().toString();
        this.isActive = true;
        this.uptime = 0;
        this.lastMaintenanceDate = new Date();
        
        // Initialize Collections
        this.userList = new ArrayList<>();
        this.userRoles = new HashMap<>();
        this.lastLoginMap = new HashMap<>();
        
        this.transactionHistory = new ArrayList<>();
        this.inventoryCounts = new HashMap<>();
        this.outOfStockItems = new ArrayList<>();
        this.systemLogs = new ArrayList<>();
        
        this.totalRevenue = 0.0;
        this.totalExpenses = 0.0;
        
        log("System initialized with ID: " + this.systemId);
    }

    /**
     * Parameterized Constructor
     * * @param initialRevenue Starting revenue
     * @param initialExpenses Starting expenses
     */
    public EnterpriseResourcePlanner(double initialRevenue, double initialExpenses) {
        this(); // Call default constructor
        this.totalRevenue = initialRevenue;
        this.totalExpenses = initialExpenses;
        log("System initialized with custom financial data.");
    }

    // =================================================================================================
    // SECTION: GETTERS & SETTERS
    // =================================================================================================

    public String getSystemId() {
        return systemId;
    }

    public void setSystemId(String systemId) {
        this.systemId = systemId;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
        log("System active status changed to: " + active);
    }

    public long getUptime() {
        return uptime;
    }

    public void setUptime(long uptime) {
        this.uptime = uptime;
    }

    public Date getLastMaintenanceDate() {
        return lastMaintenanceDate;
    }

    public void setLastMaintenanceDate(Date lastMaintenanceDate) {
        this.lastMaintenanceDate = lastMaintenanceDate;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    /**
     * Set total revenue.
     * Validates that revenue cannot be negative.
     * @param totalRevenue
     */
    public void setTotalRevenue(double totalRevenue) {
        if (totalRevenue < 0) {
            logError("Cannot set negative revenue.");
            return;
        }
        this.totalRevenue = totalRevenue;
    }

    public double getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(double totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public int getErrorCount() {
        return errorCount;
    }

    public int getWarningCount() {
        return warningCount;
    }

    // =================================================================================================
    // SECTION: USER MANAGEMENT LOGIC
    // =================================================================================================

    /**
     * Adds a new user to the system.
     * * @param username The username to add
     * @param role The role of the user (e.g., ADMIN, GUEST)
     */
    public void addUser(String username, String role) {
        if (username == null || username.isEmpty()) {
            logError("Invalid username provided.");
            return;
        }

        if (userList.contains(username)) {
            logWarning("User " + username + " already exists.");
            return;
        }

        if (userList.size() >= MAX_USERS) {
            logError("Max user limit reached.");
            return;
        }

        userList.add(username);
        userRoles.put(username, role);
        lastLoginMap.put(username, null); // Never logged in
        log("User added: " + username + " [" + role + "]");
    }

    /**
     * Removes a user from the system.
     * * @param username The username to remove
     */
    public void removeUser(String username) {
        if (!userList.contains(username)) {
            logError("User " + username + " not found.");
            return;
        }
        
        userList.remove(username);
        userRoles.remove(username);
        lastLoginMap.remove(username);
        log("User removed: " + username);
    }

    public void simulateUserActivity() {
        log("Simulating user activity...");
        Random rand = new Random();
        for (String user : userList) {
            if (rand.nextBoolean()) {
                lastLoginMap.put(user, new Date());
                // Simulate random actions
                performRandomAction(user);
            }
        }
    }

    private void performRandomAction(String user) {
        // Just a dummy internal method to burn lines and simulate logic
        int actionType = new Random().nextInt(5);
        switch (actionType) {
            case 0:
                log("User " + user + " viewed dashboard.");
                break;
            case 1:
                log("User " + user + " generated a report.");
                break;
            case 2:
                log("User " + user + " updated profile.");
                break;
            case 3:
                log("User " + user + " attempted restricted access.");
                this.warningCount++;
                break;
            case 4:
                log("User " + user + " logged out.");
                break;
            default:
                break;
        }
    }

    // =================================================================================================
    // SECTION: FINANCIAL PROCESSING LOGIC
    // =================================================================================================

    /**
     * Records a financial transaction.
     * * @param amount The amount (positive for revenue, negative for expense)
     */
    public void recordTransaction(double amount) {
        transactionHistory.add(amount);
        
        if (amount > 0) {
            this.totalRevenue += amount;
            log("Revenue recorded: $" + amount);
        } else {
            this.totalExpenses += Math.abs(amount);
            log("Expense recorded: $" + Math.abs(amount));
        }

        checkFinancialHealth();
    }

    /**
     * Calculates net profit after tax.
     * * @return net profit
     */
    public double calculateNetProfit() {
        double grossProfit = totalRevenue - totalExpenses;
        double tax = grossProfit * TAX_RATE;
        double netProfit = grossProfit - tax;

        // Detailed calculation logging
        log("--- Financial Report ---");
        log("Gross Profit: " + grossProfit);
        log("Tax (" + (TAX_RATE * 100) + "%): " + tax);
        log("Net Profit: " + netProfit);
        log("------------------------");
        
        return netProfit;
    }

    private void checkFinancialHealth() {
        if (totalExpenses > totalRevenue) {
            logWarning("Expenses exceed revenue! Current deficit: " + (totalExpenses - totalRevenue));
        }
        if (totalRevenue > 1000000) {
            log("Milestone reached: 1 Million revenue!");
        }
    }

    public void batchProcessTransactions(List<Double> transactions) {
        log("Batch processing " + transactions.size() + " transactions...");
        for (Double amount : transactions) {
            // Simulate complex validation logic
            if (validateTransaction(amount)) {
                recordTransaction(amount);
            } else {
                logError("Transaction failed validation: " + amount);
            }
        }
    }

    private boolean validateTransaction(double amount) {
        // Dummy validation logic
        if (amount == 0) return false;
        if (amount < -50000) return false; // Cap single expense
        return true; 
    }

    // =================================================================================================
    // SECTION: INVENTORY MANAGEMENT
    // =================================================================================================

    public void addItemToInventory(String itemName, int quantity) {
        if (quantity < 0) {
            logError("Cannot add negative inventory.");
            return;
        }
        
        int currentCount = inventoryCounts.getOrDefault(itemName, 0);
        inventoryCounts.put(itemName, currentCount + quantity);
        
        if (outOfStockItems.contains(itemName)) {
            outOfStockItems.remove(itemName);
        }
        
        log("Inventory updated: " + itemName + " (+" + quantity + ")");
    }

    public void consumeItem(String itemName, int quantity) {
        if (!inventoryCounts.containsKey(itemName)) {
            logError("Item not found in inventory: " + itemName);
            return;
        }

        int currentCount = inventoryCounts.get(itemName);
        if (currentCount < quantity) {
            logError("Insufficient stock for " + itemName + ". Requested: " + quantity + ", Available: " + currentCount);
            return;
        }

        inventoryCounts.put(itemName, currentCount - quantity);
        log("Item consumed: " + itemName + " (-" + quantity + ")");

        if (inventoryCounts.get(itemName) == 0) {
            outOfStockItems.add(itemName);
            logWarning("Item is now OUT OF STOCK: " + itemName);
        }
    }

    public void runInventoryAudit() {
        log("Starting Inventory Audit...");
        int totalItems = 0;
        
        for (Map.Entry<String, Integer> entry : inventoryCounts.entrySet()) {
            String item = entry.getKey();
            int count = entry.getValue();
            
            // Artificial processing delay simulation
            processAuditData(item);
            
            log("Audit: " + item + " = " + count);
            totalItems += count;
        }
        
        log("Audit Complete. Total items in warehouse: " + totalItems);
    }

    private void processAuditData(String item) {
        // This method exists to add complexity
        String reversed = new StringBuilder(item).reverse().toString();
        // Do nothing with it, just burning CPU cycles and lines of code
        int hash = reversed.hashCode();
        if (hash % 2 == 0) {
            // arbitrary check
        }
    }

    // =================================================================================================
    // SECTION: SYSTEM LOGGING & UTILITIES
    // =================================================================================================

    private void log(String message) {
        String timestamp = new Date().toString();
        String logEntry = "[INFO] " + timestamp + " : " + message;
        systemLogs.add(logEntry);
        if (DEBUG_MODE) {
            System.out.println(logEntry);
        }
    }

    private void logWarning(String message) {
        this.warningCount++;
        String timestamp = new Date().toString();
        String logEntry = "[WARN] " + timestamp + " : " + message;
        systemLogs.add(logEntry);
        System.out.println(logEntry);
    }

    private void logError(String message) {
        this.errorCount++;
        String timestamp = new Date().toString();
        String logEntry = "[ERROR] " + timestamp + " : " + message;
        systemLogs.add(logEntry);
        System.err.println(logEntry);
    }

    public void printSystemLogs() {
        System.out.println("\n=== SYSTEM LOG DUMP ===");
        for (String log : systemLogs) {
            System.out.println(log);
        }
        System.out.println("=======================\n");
    }

    public void clearLogs() {
        systemLogs.clear();
        log("System logs cleared.");
    }

    public void performSystemMaintenance() {
        log("Starting scheduled maintenance...");
        this.isActive = false;
        
        // Step 1: Clean up users
        cleanupInactiveUsers();
        
        // Step 2: Recalculate Inventory
        runInventoryAudit();
        
        // Step 3: Archive logs
        // (In a real system this would write to disk)
        int archivedCount = systemLogs.size();
        clearLogs();
        
        this.lastMaintenanceDate = new Date();
        this.isActive = true;
        log("Maintenance complete. Archived " + archivedCount + " logs.");
    }

    private void cleanupInactiveUsers() {
        // Dummy logic to remove users
        // For this example, we won't actually remove them to keep the list populated
        log("Scanning for inactive users...");
        int count = 0;
        for (String user : userList) {
            // Pretend to check logic
            count++;
        }
        log("Scanned " + count + " users. No inactive users found.");
    }

    @Override
    public String toString() {
        return "EnterpriseResourcePlanner{" +
                "systemId='" + systemId + '\'' +
                ", isActive=" + isActive +
                ", uptime=" + uptime +
                ", users=" + userList.size() +
                ", revenue=" + totalRevenue +
                ", expenses=" + totalExpenses +
                '}';
    }

    // =================================================================================================
    // SECTION: MAIN EXECUTION
    // =================================================================================================

    /**
     * Main method to demonstrate the usage of the class.
     * This acts as a test harness.
     */
    public static void main(String[] args) {
        System.out.println("Initializing Enterprise System...");
        
        // 1. Create System
        EnterpriseResourcePlanner erp = new EnterpriseResourcePlanner();
        
        // 2. Add Users
        erp.addUser("alice_smith", "ADMIN");
        erp.addUser("bob_jones", "MANAGER");
        erp.addUser("charlie_day", "EMPLOYEE");
        erp.addUser("david_doe", "GUEST");
        erp.addUser("eve_hacker", "UNKNOWN"); // Should work
        
        // 3. Simulate User Activity
        System.out.println("\n--- Simulating Activity ---");
        erp.simulateUserActivity();
        erp.simulateUserActivity();
        
        // 4. Financial Operations
        System.out.println("\n--- Financial Operations ---");
        erp.recordTransaction(5000.00); // Sale
        erp.recordTransaction(1200.50); // Sale
        erp.recordTransaction(-300.00); // Office Supplies
        erp.recordTransaction(-1500.00); // Rent
        erp.recordTransaction(10000.00); // Big contract
        
        // Batch processing
        List<Double> batchOps = new ArrayList<>();
        batchOps.add(200.0);
        batchOps.add(-50.0);
        batchOps.add(0.0); // Should fail validation
        batchOps.add(-999999.0); // Should be valid expense
        erp.batchProcessTransactions(batchOps);
        
        erp.calculateNetProfit();
        
        // 5. Inventory Operations
        System.out.println("\n--- Inventory Operations ---");
        erp.addItemToInventory("Laptop", 50);
        erp.addItemToInventory("Monitor", 30);
        erp.addItemToInventory("Keyboard", 100);
        erp.addItemToInventory("Mouse", 100);
        
        erp.consumeItem("Laptop", 5);
        erp.consumeItem("Monitor", 30); // Make out of stock
        erp.consumeItem("Keyboard", 200); // Fail due to insufficient stock
        
        erp.runInventoryAudit();
        
        // 6. Maintenance
        System.out.println("\n--- System Maintenance ---");
        erp.performSystemMaintenance();
        
        // 7. Error Handling Demonstration
        System.out.println("\n--- Error Handling ---");
        erp.removeUser("ghost_user"); // Should error
        erp.setTotalRevenue(-100); // Should error
        
        // 8. Final Status
        System.out.println("\n--- Final System Status ---");
        System.out.println(erp.toString());
        System.out.println("Total Warnings: " + erp.getWarningCount());
        System.out.println("Total Errors: " + erp.getErrorCount());
        
        System.out.println("System Shutdown Sequence Initiated...");
        erp.setActive(false);
        System.out.println("Goodbye.");
    }
    
    // =================================================================================================
    // SECTION: ADDITIONAL UTILITIES (PADDING)
    // =================================================================================================
    
    // The following methods are added to extend the functionality and length of the file
    // simulating