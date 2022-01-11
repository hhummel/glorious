## Glorious ##


An e-commerce platform tailored for simple, home-based businesses. The initial user is [title](https://GloriousGrain.com), 
but we would like to make the platform available to other entrepreurs. The goal is to make it simple enough and cheap enough that it would be useful for bakers working out of their home kitchen, for example.


The exisiting platform provides a basic web site, delivery app, mail campaigns and simple accounting like customer balances.
The implementation is template-based django. In this project we will implement DRF, build a react front-end, and improve the
functionality. The first steps are to improve the customer experience, payments and the shipping process.

### Roadmap ###

Glorious Roadmap for Customer Experience Epic:

- [x] A REST API using Django Rest Framwork should be implemented on top of the existing Django models. Session security is sufficient for now. There is logic involving foreign keys and filtering in the HTML views, so figure out how to express that logic in the views, serializers or the front end.

- [ ] A cooler looking React frontend for the customer experience should consume the REST API. Use a flow based on Amazon: A list of products, an order form, a shopping cart and a checkout form. Use Material UI for the styling. Begin with more-or-less MUI default styling.

  - [ ] Products list should be responsive and be a single column on a phone. Make a way to capture and display reviews. Each product variant should have it's own card in the list.

  - [ ] Order form should determine the number of items and should offer the choice of making the order a gift. Gift packaging should be shown. The user should be able to see past gift receipts and offered the choice of reusing the same address without re-entring the details. Delivery options should be shown: local delivery, regional delivery using a 3rd party like Doordash, and shipping. Orders for the same product but different delivery details should be separate. For local delivery, the Customer should be able to enter special instructions.

  - [ ] Shopping cart should show all the items desired, and allow deletion and edits. If editted, go back to the associated order form. The shopping cart should persist between visits, and there should be an option to clear it.

  - [ ] Checkout should include payment. Payment options should include Stripe, CoD (if we have to), and invoice at the end of the month. There should be a single payment transaction for all items in the shopping cart. The shopping cart should be cleared after checkout.

- [ ] The frontend design should assume there will be multiple stores using the same logic. This logic should also be added to the django models. No branding should be hard-coded into the front end: All images, copy and assumptions about delivery area should depend on the store.

- [ ] Customers should be able to see and edit their account settings, e.g. address, email. They should be able to see their order history and account balance.

- [ ] Customers with subscriptions should be able to see and edit their expected deliveries. Orders on subscription should be invoiced.

- [ ] Customers who ask to be invoiced should receive an invoice for their current balance at the end of the month. They should be offered the option to settle their balance using Stripe.

Glorious Roadmap for Admin Experience Epic:

- [ ] Admin should be able to see, edit and update information on Products, Customer Accounts, Marketing Campaigns, Deliveries, etc.

- [ ] The current Django template implementation will be retained until the Customer Experience Epic is completed, but the administrator interface should also be reimplemented using REST and React.

- [ ] People can and do create duplicate accounts. Switch to using email address for username, and make a tool the admin can use to merge and unmerge accounts. Unmerge is in case of a mistake.

- [ ] The admin should be able to see and edit Customer information, e.g. correct address and email.

Glorious Roadmap for Delivery Epic:

- [ ] The local delivery person should be able to see the town.

- [ ] There should be an automated route planner for the local delivery person.

- [ ] The local delivery person should not have full admin permissions.

- [ ] There should be an implementation of regional delivery, e.g. Doordash, and for shipping. There should be a way to charge for these services.

Glorious Roadmap for Devops Epic:

- [ ] Currently the website is implemented directly on an EC2 instance, with dev and staging on the same instance but with routing dependent on nginx. This should be changed to use Docker containers implemented in Fargate.

- [ ] There is no CI/CD pipeline yet. This should be implemented using a serverless platform, e.g. CircleCI.

- [ ] There are no tests, no local test db, but there should be. Currently there is a prod and staging instance on RDS for UAT.

- [ ] Secrets are held in a file excluded from github. They should be stored in SSM.
