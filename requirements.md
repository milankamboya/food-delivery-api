# Requirements

1. Your task is to write a food delivery service API.
2. You need to write an API for a simple application where users can order meals from restaurants.
3. The user must be able to create an account and log in using the API.
4. Implement 2 roles with different permission levels:

- Customer: Can see all restaurants and place orders from them.
- Restaurant Owner: Can CRUD restaurants and meals.

5. Each user can have only one account (the user is identified by an email).
6. A restaurant should have a name and description of the type of food they serve.
7. A meal should have a name, description, and price.
8. Orders include a list of meals, date, total amount, and status.
9. An order should be placed for a single restaurant only, but it can have multiple meals.
10. Orders can also contain a custom tip amount and can reference a coupon for a percentage discount.
11. There is no need to handle payment of any kind or even to simulate payment handling.
12. Restaurant owners and customers can change the order status respecting below flow and permissions:

- Placed: Once a customer places an order.
- Canceled: If the customer or restaurant owner cancels the order.
- Processing: Once the restaurant owner starts to make the meals.
- In Route: Once the meal is finished and the restaurant owner marks it's on the way.
- Delivered: Once the restaurant owner receives information that the meal was delivered by their staff.
- Received: Once the customer receives the meal and marks it as received.

13. Orders should have a history of the date and time of the status change.
14. Customers should be able to browse their order history and view updated order status.
15. Customers and restaurant owners should be able to see a list of the orders.

# Implement Administrator Role

16. An administrator who can CRUD users (of any role), restaurants, and meals and change all user/restaurant/meal information, including blocking.
17. The application should include one built-in admin account that cannot be deleted.
18. REST/GraphQL API. Make it possible to perform all user and admin actions via the API, including authentication.
