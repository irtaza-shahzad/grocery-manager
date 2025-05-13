--23L - 0846 Muhammad Basim
--23L - 0873 Umer Karamat
--23L - 0959 Irtaza Shahzad


-- Create database
CREATE DATABASE GroceryStore;
GO

USE GroceryStore;
GO

-- Users Table
CREATE TABLE [dbo].[Users] (
    [UserID] INT IDENTITY(1,1) PRIMARY KEY,
    [Username] NVARCHAR(50) UNIQUE NOT NULL,
    [PasswordHash] NVARCHAR(255) NOT NULL,
    [Email] NVARCHAR(100) UNIQUE NOT NULL,
    [Role] NVARCHAR(20) CHECK ([Role] IN ('Customer', 'Admin')),
    [CreatedAt] DATETIME DEFAULT GETDATE()
);

-- Categories Table
CREATE TABLE [dbo].[Categories] (
    [CategoryID] INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(50) UNIQUE NOT NULL,
    [Description] NVARCHAR(MAX) NULL,
    [CreatedAt] DATETIME DEFAULT GETDATE()
);

-- Products Table
CREATE TABLE [dbo].[Products] (
    [ProductID] INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL,
    [Price] DECIMAL(10,2) NOT NULL,
    [StockQuantity] INT NOT NULL DEFAULT 0,
    [CategoryID] INT NOT NULL,
    [Description] NVARCHAR(MAX) NULL,
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    CONSTRAINT [FK_Products_Categories] FOREIGN KEY ([CategoryID]) REFERENCES Categories(CategoryID),
    INDEX IX_CategoryID NONCLUSTERED(CategoryID)
);

-- Orders Table
CREATE TABLE [dbo].[Orders] (
    [OrderID] INT IDENTITY(1,1) PRIMARY KEY,
    [UserID] INT NOT NULL,
    [OrderDate] DATETIME DEFAULT GETDATE(),
    [TotalAmount] DECIMAL(10,2) NOT NULL,
    [Status] NVARCHAR(20) CHECK ([Status] IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    CONSTRAINT [FK_Orders_Users] FOREIGN KEY ([UserID]) REFERENCES Users(UserID),
    INDEX IX_UserID NONCLUSTERED(UserID)
);

-- OrderItems Table
CREATE TABLE [dbo].[OrderItems] (
    [OrderItemID] INT IDENTITY(1,1) PRIMARY KEY,
    [OrderID] INT NOT NULL,
    [ProductID] INT NOT NULL,
    [Quantity] INT NOT NULL CHECK ([Quantity] > 0),
    [UnitPrice] DECIMAL(10,2) NOT NULL,
    CONSTRAINT [FK_OrderItems_Orders] FOREIGN KEY ([OrderID]) REFERENCES Orders(OrderID),
    CONSTRAINT [FK_OrderItems_Products] FOREIGN KEY ([ProductID]) REFERENCES Products(ProductID),
    INDEX IX_OrderID NONCLUSTERED(OrderID)
);

-- CartItems Table
CREATE TABLE [dbo].[CartItems] (
    [CartItemID] INT IDENTITY(1,1) PRIMARY KEY,
    [UserID] INT NOT NULL,
    [ProductID] INT NOT NULL,
    [Quantity] INT NOT NULL CHECK ([Quantity] > 0),
    CONSTRAINT [FK_CartItems_Users] FOREIGN KEY ([UserID]) REFERENCES Users(UserID),
    CONSTRAINT [FK_CartItems_Products] FOREIGN KEY ([ProductID]) REFERENCES Products(ProductID),
    INDEX IX_UserIDCart NONCLUSTERED(UserID)
);

-- ProductReviews Table
CREATE TABLE [dbo].[ProductReviews] (
    [ReviewID] INT IDENTITY(1,1) PRIMARY KEY,
    [ProductID] INT NOT NULL,
    [UserID] INT NOT NULL,
    [Rating] TINYINT NOT NULL CHECK ([Rating] BETWEEN 1 AND 5),
    [Comments] NVARCHAR(MAX) NULL,
    [CreatedAt] DATETIME DEFAULT GETDATE(),
    CONSTRAINT [FK_Reviews_Products] FOREIGN KEY ([ProductID]) REFERENCES Products(ProductID),
    CONSTRAINT [FK_Reviews_Users] FOREIGN KEY ([UserID]) REFERENCES Users(UserID),
    INDEX IX_ProductReviews_ProductID NONCLUSTERED(ProductID)
);

CREATE TABLE Recipes (
    RecipeID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    CONSTRAINT CHK_RecipeName CHECK (Name <> '')
);

CREATE TABLE RecipeIngredients (
    RecipeIngredientID INT IDENTITY(1,1) PRIMARY KEY,
    RecipeID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    CONSTRAINT FK_RecipeIngredients_Recipes FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID) ON DELETE CASCADE,
    CONSTRAINT FK_RecipeIngredients_Products FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    CONSTRAINT CHK_RecipeIngredientQuantity CHECK (Quantity > 0)
);

CREATE TABLE FavouriteProducts (
    FavouriteID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    AddedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_FavouriteProducts_Users FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_FavouriteProducts_Products FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    CONSTRAINT UQ_UserProduct UNIQUE (UserID, ProductID) -- Prevents duplicate favorites per user
);

-- Insert data into Categories table first
INSERT INTO Categories (Name, Description) VALUES
('Fruits', 'Fresh fruits and berries'),
('Vegetables', 'Fresh vegetables and greens'),
('Dairy', 'Milk products and dairy items'),
('Bakery', 'Fresh baked goods'),
('Pantry', 'Canned and packaged goods');

-- Insert data into Users table
INSERT INTO Users (Username, PasswordHash, Email, Role) VALUES
('admin123', 'admin_hash_123', 'admin@example.com', 'Admin'),
('user1', 'user1_hash', 'user1@example.com', 'Customer'),
('user2', 'user2_hash', 'user2@example.com', 'Customer'),
('user3', 'user3_hash', 'user3@example.com', 'Customer'),
('user4', 'user4_hash', 'user4@example.com', 'Customer');

-- Insert data into Products table
INSERT INTO Products (Name, Price, StockQuantity, CategoryID, Description) VALUES
('Apple', 1.99, 100, 1, 'Fresh red apples'),
('Carrot', 0.69, 200, 2, 'Fresh orange carrots'),
('Milk', 3.99, 50, 3, '2% low-fat milk'),
('Bread', 2.49, 75, 4, 'Whole wheat bread'),
('Rice', 1.99, 150, 5, 'White long grain rice'),
('Eggs', 2.99, 80, 3, 'Fresh large eggs'),              
('Butter', 4.49, 60, 3, 'Unsalted butter'),            
('Cinnamon', 1.29, 100, 5, 'Ground cinnamon spice');

-- Insert data into Orders table
INSERT INTO Orders (UserID, TotalAmount, Status) VALUES
(2, 10.97, 'Pending'),  -- user1's order
(3, 7.47, 'Processing'),  -- user2's order
(4, 5.98, 'Shipped'),  -- user3's order
(5, 3.99, 'Delivered'),  -- user4's order
(2, 4.98, 'Cancelled');  -- user1's second order

-- Insert data into OrderItems table
INSERT INTO OrderItems (OrderID, ProductID, Quantity, UnitPrice) VALUES
(1, 1, 2, 1.99),  -- user1: 2 apples
(1, 2, 3, 0.69),  -- user1: 3 carrots
(2, 3, 2, 3.99),  -- user2: 2 milks
(3, 4, 1, 2.49),  -- user3: 1 bread
(3, 5, 2, 1.49),  -- user3: 2 rice
(4, 1, 1, 1.99),  -- user4: 1 apple
(4, 3, 1, 1.99),  -- user4: 1 milk
(5, 5, 3, 1.66);  -- user1: 3 rice (cancelled order)

-- Insert data into CartItems table
INSERT INTO CartItems (UserID, ProductID, Quantity) VALUES
(2, 4, 1),  -- user1 has bread in cart
(3, 1, 2),  -- user2 has apples in cart
(4, 2, 1),  -- user3 has carrots in cart
(5, 3, 1),  -- user4 has milk in cart
(2, 5, 2);  -- user1 has rice in cart

-- Insert data into ProductReviews table
INSERT INTO ProductReviews (ProductID, UserID, Rating, Comments) VALUES
(1, 2, 5, 'Fresh and delicious!'),
(2, 3, 4, 'Good quality carrots'),
(3, 4, 5, 'Perfect milk, great price'),
(4, 5, 3, 'Fresh but a bit dense'),
(5, 2, 4, 'Good quality rice');

-- Insert data into Recipe Table
INSERT INTO Recipes (Name, Description)
VALUES 
    ('Carrot Cake', 'A moist carrot cake with a sweet frosting.'),
    ('Apple Pie', 'A classic apple pie with a flaky crust.'),
    ('Pancakes', 'Fluffy pancakes perfect for breakfast.'),
    ('Vegetable Soup', 'A hearty soup made with fresh veggies.'),
    ('Omelette', 'A simple and delicious egg omelette.');

-- Insert data into RecipeIngredients Table
INSERT INTO RecipeIngredients (RecipeID, ProductID, Quantity)
VALUES
    (1, 2, 2),   -- Carrot Cake: 2 Carrots (ProductID = 2)
    (1, 7, 1),   -- Carrot Cake: 1 Butter (ProductID = 7)
    (1, 5, 3),   -- Carrot Cake: 3 Rice (as Flour placeholder, ProductID = 5)
    (2, 1, 4),   -- Apple Pie: 4 Apples (ProductID = 1)
    (2, 7, 1),   -- Apple Pie: 1 Butter (ProductID = 7)
    (2, 8, 1),   -- Apple Pie: 1 Cinnamon (ProductID = 8)
    (2, 5, 2),   -- Apple Pie: 2 Rice (as Flour, ProductID = 5)
    (3, 3, 2),   -- Pancakes: 2 Milk (ProductID = 3)
    (3, 6, 2),   -- Pancakes: 2 Eggs (ProductID = 6)
    (3, 5, 2),   -- Pancakes: 2 Rice (as Flour, ProductID = 5)
    (4, 2, 3),   -- Vegetable Soup: 3 Carrots (ProductID = 2)
    (4, 3, 1),   -- Vegetable Soup: 1 Milk (ProductID = 3)
    (5, 6, 3);   -- Omelette: 3 Eggs (ProductID = 6)

-- Insert data Favourite Products
INSERT INTO FavouriteProducts (UserID, ProductID)
VALUES
    (2, 1),  -- user1 favorites Apple
    (2, 3),  -- user1 favorites Milk
    (3, 2),  -- user2 favorites Carrot
    (4, 5),  -- user3 favorites Rice
    (5, 6),  -- user4 favorites Eggs
    (3, 7);  -- user2 favorites Butter (bonus tuple for variety)
	

Select * from Categories;
Select * from Users;
Select * from Products;
Select * from ProductReviews;
Select * from Orders;
Select * from OrderItems;
Select * from CartItems;
Select * from Recipes;
Select * from RecipeIngredients;
SELECT * FROM FavouriteProducts

--                                     1. User Management Queries (2)
--a. User Registration (Stored Procedure)
GO
CREATE PROCEDURE RegisterUser
    @Username NVARCHAR(50),
    @PasswordHash NVARCHAR(255),
    @Email NVARCHAR(100),
    @Role NVARCHAR(20)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = @Username OR Email = @Email)
    BEGIN
        INSERT INTO Users (Username, PasswordHash, Email, Role)
        VALUES (@Username, @PasswordHash, @Email, @Role);
    END
    ELSE
        RAISERROR ('Username or Email already exists', 16, 1);
END;
GO

--b.Login verification

SELECT UserID, Username, Role
FROM Users
WHERE Username = 'Umer Karamat3' AND PasswordHash = 'basimkake2';

---------------------------------------------------------------------------------------------------------------------------------

--                                   2.Product Browsing (4)

--a.Get all products by category

SELECT p.ProductID, p.Name, p.Price, p.StockQuantity, c.Name AS CategoryName
FROM Products p
JOIN Categories c ON p.CategoryID = c.CategoryID
WHERE c.Name = 'Fruits';

--b.Filter products by price range and sort result ascending

SELECT ProductID, Name, Price, StockQuantity
FROM Products
WHERE Price BETWEEN 0.00 AND 5.00 AND StockQuantity > 0
ORDER BY Price ASC;


--c. Search product by name
GO
CREATE PROCEDURE SearchProductsByName
    @SearchTerm NVARCHAR(100)
AS
BEGIN
    SELECT ProductID, Name, Price, StockQuantity
    FROM Products
    WHERE Name LIKE '%' + @SearchTerm + '%'
    AND StockQuantity > 0;
END;
GO

-- Execute it
EXEC SearchProductsByName @SearchTerm = 'apple';
EXEC SearchProductsByName @SearchTerm = 'milk';


--d. Product Listing (View)
GO
CREATE VIEW vw_ProductListing AS
SELECT p.ProductID, p.Name, p.Price, p.StockQuantity, c.Name AS CategoryName, p.Description
FROM Products p
JOIN Categories c ON p.CategoryID = c.CategoryID;
GO

Select * from vw_ProductListing


---------------------------------------------------------------------------------------------------------------------------------

--                                  3.Cart Management (6)

--a. Adding item to cart

GO
CREATE PROCEDURE AddItemToCart
    @UserID INT,
    @ProductID INT,
    @Quantity INT
AS
BEGIN
    INSERT INTO CartItems (UserID, ProductID, Quantity)
    VALUES (@UserID, @ProductID, @Quantity);
END;
GO

EXEC AddItemToCart @UserID = 2, @ProductID = 1, @Quantity = 1;

--b.  View Cart Items with Total

GO
CREATE PROCEDURE GetUserCart
    @UserID INT
AS
BEGIN
    SELECT ci.CartItemID, p.Name, ci.Quantity, p.Price, (ci.Quantity * p.Price) AS SubTotal
    FROM CartItems ci
    JOIN Products p ON ci.ProductID = p.ProductID
    WHERE ci.UserID = @UserID;
END;
GO

EXEC GetUserCart @UserID = 2;


--c. Updating Cart Item Quantity

GO
CREATE PROCEDURE UpdateCartItemQuantity
    @CartItemID INT,
    @UserID INT,
    @Quantity INT
AS
BEGIN
    UPDATE CartItems
    SET Quantity = @Quantity
    WHERE CartItemID = @CartItemID AND UserID = @UserID;
END;
GO

EXEC UpdateCartItemQuantity @CartItemID = 1, @UserID = 2, @Quantity = 2;

--d. Removing item from the cart
GO

CREATE PROCEDURE RemoveCartItem
    @CartItemID INT,
    @UserID INT
AS
BEGIN
    DELETE FROM CartItems
    WHERE CartItemID = @CartItemID AND UserID = @UserID;
END;
GO

EXEC RemoveCartItem @CartItemID = 1, @UserID = 2;

--e. AddToCart (Stored Procedure)

GO

CREATE PROCEDURE AddToCart
    @UserID INT,
    @ProductID INT,
    @Quantity INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID AND StockQuantity >= @Quantity)
    BEGIN
        IF EXISTS (SELECT 1 FROM CartItems WHERE UserID = @UserID AND ProductID = @ProductID)
            UPDATE CartItems
            SET Quantity = Quantity + @Quantity
            WHERE UserID = @UserID AND ProductID = @ProductID;
        ELSE
            INSERT INTO CartItems (UserID, ProductID, Quantity)
            VALUES (@UserID, @ProductID, @Quantity);
    END
    ELSE
        RAISERROR ('Insufficient stock', 16, 1);
END;
GO

EXEC AddToCart @UserID = 2, @ProductID = 1, @Quantity = 3;

--f. View All User Cart

GO
CREATE VIEW vw_UserCart AS
SELECT ci.UserID, ci.CartItemID, p.Name, ci.Quantity, p.Price, (ci.Quantity * p.Price) AS SubTotal
FROM CartItems ci
JOIN Products p ON ci.ProductID = p.ProductID;
GO

Select * from vw_UserCart

------------------------------------------------------------------------------------------------------------------------

--                                     4.Order Placement (1)

--a. Place an order from the cart

GO
CREATE PROCEDURE PlaceOrderFromCart
    @UserID INT
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Step 1: Create the Order
        INSERT INTO Orders (UserID, TotalAmount, Status)
        SELECT @UserID, SUM(ci.Quantity * p.Price), 'Pending'
        FROM CartItems ci
        JOIN Products p ON ci.ProductID = p.ProductID
        WHERE ci.UserID = @UserID;

        -- Step 2: Capture the New OrderID
        DECLARE @OrderID INT = SCOPE_IDENTITY();

        -- Step 3: Transfer Cart Items to OrderItems
        INSERT INTO OrderItems (OrderID, ProductID, Quantity, UnitPrice)
        SELECT @OrderID, ci.ProductID, ci.Quantity, p.Price
        FROM CartItems ci
        JOIN Products p ON ci.ProductID = p.ProductID
        WHERE ci.UserID = @UserID;

        -- Step 4: Update Product Stock
        UPDATE p
        SET p.StockQuantity = p.StockQuantity - ci.Quantity
        FROM Products p
        JOIN CartItems ci ON p.ProductID = p.ProductID
        WHERE ci.UserID = @UserID;

        -- Step 5: Clear the Cart
        DELETE FROM CartItems 
        WHERE UserID = @UserID;

        -- Commit the transaction if all steps succeed
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Roll back the transaction if any step fails
        ROLLBACK TRANSACTION;
        RAISERROR ('Failed to place order from cart', 16, 1);
    END CATCH;
END;

EXEC PlaceOrderFromCart @UserID = 2;	

-----------------------------------------------------------------------------------------------------------------------
 
 --                                  5.Order Status (3)

--a.  View User's Order History
Go
CREATE PROCEDURE GetUserOrderHistory
    @UserID INT
AS
BEGIN
    SELECT OrderID, OrderDate, TotalAmount, Status
    FROM Orders
    WHERE UserID = @UserID
    ORDER BY OrderDate DESC;
END;

Execute GetUserOrderHistory 2

--b. View Order Details
go 
CREATE PROCEDURE GetOrderDetails
    @OrderID INT
AS
BEGIN
    SELECT oi.OrderItemID, p.Name, oi.Quantity, oi.UnitPrice
    FROM OrderItems oi
    JOIN Products p ON oi.ProductID = p.ProductID
    WHERE oi.OrderID = @OrderID;
END;

Execute GetOrderDetails 2

--c.Order History of All Users

GO
CREATE VIEW vw_OrderHistory AS
SELECT o.OrderID, o.UserID, o.OrderDate, o.TotalAmount, o.Status, u.Username
FROM Orders o
JOIN Users u ON o.UserID = u.UserID;
GO

Select * from vw_OrderHistory

-----------------------------------------------------------------------------------------------------------------------

--                                6.Customer Reviews and Ratings (4)

--a. Add a review

GO
CREATE PROCEDURE AddProductReview
    @ProductID INT,
    @UserID INT,
    @Rating INT,
    @Comments NVARCHAR(255)
AS
BEGIN
    -- Validate inputs
    IF EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
        AND EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
        AND @Rating BETWEEN 1 AND 5
    BEGIN
        INSERT INTO ProductReviews (ProductID, UserID, Rating, Comments)
        VALUES (@ProductID, @UserID, @Rating, @Comments);
    END
    ELSE
        RAISERROR ('Invalid product, user, or rating (must be 1-5)', 16, 1);
END;

EXEC AddProductReview @ProductID = 1, @UserID = 2, @Rating = 5, @Comments = 'Really fresh apples!';

--b. View product reviews (Retrieves all reviews for a specific product)

GO
CREATE PROCEDURE GetProductReviews
    @ProductID INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
    BEGIN
        SELECT pr.ReviewID, u.Username, pr.Rating, pr.Comments, pr.CreatedAt
        FROM ProductReviews pr
        JOIN Users u ON pr.UserID = u.UserID
        WHERE pr.ProductID = @ProductID;
    END
    ELSE
        RAISERROR ('Product not found', 16, 1);
END;

EXEC GetProductReviews @ProductID = 1;
EXEC GetProductReviews @ProductID = 3;

--c. Average rating for a product

GO
CREATE PROCEDURE GetProductRatingSummary
    @ProductID INT
AS
BEGIN
    SELECT AVG(Rating) AS AverageRating, COUNT(*) AS ReviewCount
    FROM ProductReviews
    WHERE ProductID = @ProductID;
END;

EXEC GetProductRatingSummary @ProductID = 1;

--d. Product Reviews (Creates a view of all product reviews with usernames)

GO
CREATE VIEW vw_ProductReviews AS
SELECT pr.ReviewID, pr.ProductID, u.Username, pr.Rating, pr.Comments, pr.CreatedAt
FROM ProductReviews pr
JOIN Users u ON pr.UserID = u.UserID;
GO

Select * from vw_ProductReviews

-----------------------------------------------------------------------------------------------------------------------

--                                7.User-Friendly Interface (2)

--a. Get low stock products (Retrieves products with stock below a threshold (10) for notifications or restocking.)

SELECT ProductID, Name, StockQuantity
FROM Products
WHERE StockQuantity < 10;

--b. Get Popular Products (Retrieves the most sold products based on order item quantities, sorted by total sold.)

	SELECT top 10 p.ProductID, p.Name, SUM(oi.Quantity) AS TotalSold
	FROM OrderItems oi
	JOIN Products p ON oi.ProductID = p.ProductID
	GROUP BY p.ProductID, p.Name
	ORDER BY TotalSold DESC

-----------------------------------------------------------------------------------------------------------------------

--                             8.Inventory Management Dashboard (3)

--a. Total sales by category

SELECT c.Name AS CategoryName, SUM(oi.Quantity * oi.UnitPrice) AS TotalSales
FROM OrderItems oi
JOIN Products p ON oi.ProductID = p.ProductID
JOIN Categories c ON p.CategoryID = c.CategoryID
GROUP BY c.Name;

--b. Update product stock (Increases the stock quantity of a specific product by a given amount.)

GO
CREATE PROCEDURE UpdateProductStock
    @ProductID INT,
    @QuantityChange INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
        AND (SELECT StockQuantity FROM Products WHERE ProductID = @ProductID) + @QuantityChange >= 0
    BEGIN
        UPDATE Products
        SET StockQuantity = StockQuantity + @QuantityChange
        WHERE ProductID = @ProductID;
    END
    ELSE
        RAISERROR ('Product not found or stock would become negative', 16, 1);
END;

Execute UpdateProductStock 2,25

--c. Total orders by status (Counts the number of orders per status (e.g., Pending, Shipped).)

SELECT Status, COUNT(*) AS OrderCount
FROM Orders
GROUP BY Status;


------------------------------------------------------------------------------------------------------------------------
--                             9. Recipe Integration Feature (4)

--a. Insert a sample recipe

CREATE TYPE IngredientListType AS TABLE (
    ProductID INT,
    Quantity INT
);

GO
CREATE PROCEDURE AddRecipeWithIngredients
    @Name NVARCHAR(100),
    @Description NVARCHAR(500),
    @Ingredients IngredientListType READONLY
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- Step 1: Insert the recipe into Recipes table
        INSERT INTO Recipes (Name, Description)
        VALUES (@Name, @Description);

        -- Step 2: Capture the newly inserted RecipeID
        DECLARE @RecipeID INT = SCOPE_IDENTITY();

        -- Step 3: Check if all ProductIDs exist in Products table
        IF EXISTS (
            SELECT 1 
            FROM @Ingredients i
            LEFT JOIN Products p ON i.ProductID = p.ProductID
            WHERE p.ProductID IS NULL
        )
        BEGIN
            RAISERROR ('One or more ProductIDs do not exist in the Products table', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Step 4: Validate Quantity is positive
        IF EXISTS (SELECT 1 FROM @Ingredients WHERE Quantity <= 0)
        BEGIN
            RAISERROR ('Quantity must be greater than 0 for all ingredients', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Step 5: Insert ingredients into RecipeIngredients table
        INSERT INTO RecipeIngredients (RecipeID, ProductID, Quantity)
        SELECT @RecipeID, ProductID, Quantity
        FROM @Ingredients;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
go 
--Execution

DECLARE @Ingredients IngredientListType;

INSERT INTO @Ingredients (ProductID, Quantity)
VALUES 
    (3, 2), -- 2 Milk (ProductID = 3)
    (6, 2), -- 2 Eggs (ProductID = 6)
    (5, 1); -- 1 Rice (ProductID = 5, as Flour placeholder)

EXEC AddRecipeWithIngredients 
    @Name = 'Pancakes', 
    @Description = 'Fluffy pancakes perfect for breakfast', 
    @Ingredients = @Ingredients;


--b. Generate shopping list from recipe (Retrieves a list of products and quantities needed for a specific recipe.)
GO
CREATE PROCEDURE GetRecipeIngredients
    @RecipeID INT
AS
BEGIN
    SELECT p.ProductID, p.Name, ri.Quantity
    FROM RecipeIngredients ri
    JOIN Products p ON ri.ProductID = p.ProductID
    WHERE ri.RecipeID = @RecipeID;
END;

EXEC GetRecipeIngredients @RecipeID = 1;

--c. Add recipe ingredients to cart (Adds all ingredients from a recipe to a user�s cart.)
GO
CREATE PROCEDURE AddRecipeIngredientsToCart
    @UserID INT,
    @RecipeID INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- Validate UserID exists
        IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
        BEGIN
            RAISERROR ('User not found', 16, 1);
            RETURN;
        END

        -- Validate RecipeID exists
        IF NOT EXISTS (SELECT 1 FROM Recipes WHERE RecipeID = @RecipeID)
        BEGIN
            RAISERROR ('Recipe not found', 16, 1);
            RETURN;
        END

        -- Check stock availability for all ingredients
        IF EXISTS (
            SELECT 1
            FROM RecipeIngredients ri
            JOIN Products p ON ri.ProductID = p.ProductID
            WHERE ri.RecipeID = @RecipeID
            AND p.StockQuantity < ri.Quantity
        )
        BEGIN
            RAISERROR ('Insufficient stock for one or more ingredients', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Insert ingredients into CartItems
        INSERT INTO CartItems (UserID, ProductID, Quantity)
        SELECT @UserID, ri.ProductID, ri.Quantity
        FROM RecipeIngredients ri
        WHERE ri.RecipeID = @RecipeID;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;

EXEC AddRecipeIngredientsToCart @UserID = 2, @RecipeID = 1;

--d. View all recipes

GO
CREATE VIEW vw_AllRecipes AS
SELECT RecipeID, Name, Description
FROM Recipes;
GO

Select * from vw_AllRecipes


------------------------------------------------------------------------------------------------------------------------
--                                   10. Favorites List (3)

--a. Add to favorites (Adds a product to a user�s favorites list in a proposed Favorites table.)

GO
CREATE PROCEDURE AddToFavourites
    @UserID INT,
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- Check if UserID exists
        IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
        BEGIN
            RAISERROR ('User does not exist', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Check if ProductID exists
        IF NOT EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
        BEGIN
            RAISERROR ('Favourite product does not exist in the Products table', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Check if the product is already favorited by the user
        IF EXISTS (SELECT 1 FROM FavouriteProducts WHERE UserID = @UserID AND ProductID = @ProductID)
        BEGIN
            RAISERROR ('Product is already in the user''s favourites', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Insert into FavouriteProducts
        INSERT INTO FavouriteProducts (UserID, ProductID)
        VALUES (@UserID, @ProductID);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO

-- Execution examples
EXEC AddToFavourites @UserID = 2, @ProductID = 1;
EXEC AddToFavourites @UserID = 3, @ProductID = 6;

--b. View users favorites (Retrieves a users favorite products with their names and prices from the proposed Favorites table.)

GO
CREATE PROCEDURE GetUserFavourites
    @UserID INT
AS
BEGIN
    SELECT f.FavouriteID, p.Name, p.Price
    FROM FavouriteProducts f
    JOIN Products p ON f.ProductID = p.ProductID
    WHERE f.UserID = @UserID;
END;

Execute GetUserFavourites 4

--c. Remove from favorites (Deletes a specific product from a user�s favorites list based on FavoriteID and UserID.)

GO
CREATE PROCEDURE RemoveFromFavourites
    @FavouriteID INT,
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the FavouriteID exists and belongs to the specified UserID
    IF NOT EXISTS (
        SELECT 1 
        FROM FavouriteProducts 
        WHERE FavouriteID = @FavouriteID 
        AND UserID = @UserID
    )
    BEGIN
        RAISERROR ('Favourite entry not found for this user', 16, 1);
        RETURN;
    END

    -- Delete the favourite entry
    DELETE FROM FavouriteProducts
    WHERE FavouriteID = @FavouriteID
    AND UserID = @UserID;
END;

EXEC RemoveFromFavourites @FavouriteID = 3, @UserID = 3;

------------------------------------------------------------------------------------------------------------------------


-- Admin-Only Queries for Grocery Management System

-- 1. Add Product (Admin Only)
GO
CREATE PROCEDURE AddProduct
    @Name NVARCHAR(100),
    @Price DECIMAL(10,2),
    @StockQuantity INT,
    @CategoryID INT,
    @Description NVARCHAR(MAX),
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if user is Admin
    IF EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID AND Role = 'Admin')
    BEGIN
        BEGIN TRY
            -- Validate CategoryID exists
            IF NOT EXISTS (SELECT 1 FROM Categories WHERE CategoryID = @CategoryID)
            BEGIN
                RAISERROR ('Invalid CategoryID', 16, 1);
                RETURN;
            END
            
            -- Validate input parameters
            IF @Price < 0 OR @StockQuantity < 0
            BEGIN
                RAISERROR ('Price and StockQuantity must be non-negative', 16, 1);
                RETURN;
            END

            INSERT INTO Products (Name, Price, StockQuantity, CategoryID, Description)
            VALUES (@Name, @Price, @StockQuantity, @CategoryID, @Description);
            
            SELECT SCOPE_IDENTITY() AS NewProductID;
        END TRY
        BEGIN CATCH
            THROW;
        END CATCH
    END
    ELSE
    BEGIN
        RAISERROR ('Only Admin users can add products', 16, 1);
    END
END;
GO

-- Example execution
EXEC AddProduct 
    @Name = 'Banana', 
    @Price = 0.99, 
    @StockQuantity = 150, 
    @CategoryID = 1, 
    @Description = 'Fresh yellow bananas', 
    @UserID = 1; -- Assuming UserID 1 is admin

-- 2. Update Product (Admin Only)
GO
CREATE PROCEDURE UpdateProduct
    @ProductID INT,
    @Name NVARCHAR(100),
    @Price DECIMAL(10,2),
    @StockQuantity INT,
    @CategoryID INT,
    @Description NVARCHAR(MAX),
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if user is Admin
    IF EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID AND Role = 'Admin')
    BEGIN
        BEGIN TRY
            -- Validate ProductID exists
            IF NOT EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
            BEGIN
                RAISERROR ('Product not found', 16, 1);
                RETURN;
            END
            
            -- Validate CategoryID exists
            IF NOT EXISTS (SELECT 1 FROM Categories WHERE CategoryID = @CategoryID)
            BEGIN
                RAISERROR ('Invalid CategoryID', 16, 1);
                RETURN;
            END
            
            -- Validate input parameters
            IF @Price < 0 OR @StockQuantity < 0
            BEGIN
                RAISERROR ('Price and StockQuantity must be non-negative', 16, 1);
                RETURN;
            END

            UPDATE Products
            SET Name = @Name,
                Price = @Price,
                StockQuantity = @StockQuantity,
                CategoryID = @CategoryID,
                Description = @Description
            WHERE ProductID = @ProductID;
        END TRY
        BEGIN CATCH
            THROW;
        END CATCH
    END
    ELSE
    BEGIN
        RAISERROR ('Only Admin users can update products', 16, 1);
    END
END;
GO

-- Example execution
EXEC UpdateProduct 
    @ProductID = 1, 
    @Name = 'Apple (Updated)', 
    @Price = 2.49, 
    @StockQuantity = 120, 
    @CategoryID = 1, 
    @Description = 'Fresh red apples - premium', 
    @UserID = 1;

-- 3. Delete Product (Admin Only)
GO
CREATE PROCEDURE DeleteProduct
    @ProductID INT,
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if user is Admin
    IF EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID AND Role = 'Admin')
    BEGIN
        BEGIN TRY
            -- Check if product exists
            IF NOT EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
            BEGIN
                RAISERROR ('Product not found', 16, 1);
                RETURN;
            END
            
            -- Check if product is referenced in other tables
            IF EXISTS (SELECT 1 FROM OrderItems WHERE ProductID = @ProductID)
            OR EXISTS (SELECT 1 FROM CartItems WHERE ProductID = @ProductID)
            OR EXISTS (SELECT 1 FROM ProductReviews WHERE ProductID = @ProductID)
            OR EXISTS (SELECT 1 FROM RecipeIngredients WHERE ProductID = @ProductID)
            OR EXISTS (SELECT 1 FROM FavouriteProducts WHERE ProductID = @ProductID)
            BEGIN
                RAISERROR ('Cannot delete product - it is referenced in other records', 16, 1);
                RETURN;
            END

            DELETE FROM Products
            WHERE ProductID = @ProductID;
        END TRY
        BEGIN CATCH
            THROW;
        END CATCH
    END
    ELSE
    BEGIN
        RAISERROR ('Only Admin users can delete products', 16, 1);
    END
END;
GO

-- Example execution
EXEC DeleteProduct @ProductID = 3, @UserID = 1;

-- 4. Manage Users (Admin Only)
GO
CREATE PROCEDURE ManageUsers
    @UserID INT,              -- The admin performing the action
    @TargetUserID INT,        -- The user to manage
    @Action NVARCHAR(20),     -- 'UpdateRole' or 'Delete'
    @NewRole NVARCHAR(20) = NULL -- Required for UpdateRole action
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if user is Admin
    IF EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID AND Role = 'Admin')
    BEGIN
        BEGIN TRY
            -- Validate TargetUserID exists
            IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @TargetUserID)
            BEGIN
                RAISERROR ('Target user not found', 16, 1);
                RETURN;
            END
            
            -- Prevent admin from modifying themselves
            IF @UserID = @TargetUserID
            BEGIN
                RAISERROR ('Admins cannot modify their own account through this procedure', 16, 1);
                RETURN;
            END

            IF @Action = 'UpdateRole'
            BEGIN
                -- Validate NewRole
                IF @NewRole NOT IN ('Customer', 'Admin')
                BEGIN
                    RAISERROR ('Invalid role specified', 16, 1);
                    RETURN;
                END
                
                UPDATE Users
                SET Role = @NewRole
                WHERE UserID = @TargetUserID;
            END
            ELSE IF @Action = 'Delete'
            BEGIN
                -- Check if user has any orders or dependencies
                IF EXISTS (SELECT 1 FROM Orders WHERE UserID = @TargetUserID)
                OR EXISTS (SELECT 1 FROM CartItems WHERE UserID = @TargetUserID)
                OR EXISTS (SELECT 1 FROM ProductReviews WHERE UserID = @TargetUserID)
                OR EXISTS (SELECT 1 FROM FavouriteProducts WHERE UserID = @TargetUserID)
                BEGIN
                    RAISERROR ('Cannot delete user with existing records', 16, 1);
                    RETURN;
                END
                
                DELETE FROM Users
                WHERE UserID = @TargetUserID;
            END
            ELSE
            BEGIN
                RAISERROR ('Invalid action specified. Use ''UpdateRole'' or ''Delete''', 16, 1);
            END
        END TRY
        BEGIN CATCH
            THROW;
        END CATCH
    END
    ELSE
    BEGIN
        RAISERROR ('Only Admin users can manage other users', 16, 1);
    END
END;
GO

-- Example executions
EXEC ManageUsers @UserID = 1, @TargetUserID = 2, @Action = 'UpdateRole', @NewRole = 'Admin';
go
EXEC ManageUsers @UserID = 1, @TargetUserID = 2, @Action = 'Delete';