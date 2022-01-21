## Glorious ##


An e-commerce platform tailored for simple, home-based businesses. The initial user is [GloriousGrain.com](https://GloriousGrain.com), 
but we would like to make the platform available to other entrepreneurs. The goal is to make it simple enough and cheap enough that it would be useful for bakers working out of their home kitchen, for example.


The exisiting platform provides a basic web site, delivery app, mail campaigns and simple accounting like customer balances.
The implementation is template-based django. In this project we will implement DRF, build a react front-end, and improve the
functionality. The first steps are to improve the customer experience, payments and the shipping process.

### Roadmap ###

Glorious Roadmap for Customer Experience Epic: A cooler looking React frontend for the customer experience should consume a REST API, building off the existing models. Use a flow based on Amazon: A list of products, an order form, a shopping cart and a checkout form. Use Material UI for the styling. Begin with more-or-less MUI default styling.

- [x] A REST API using Django Rest Framwork should be implemented on top of the existing Django models. Session security is sufficient for now. There is logic involving foreign keys and filtering in the HTML views, so figure out how to express that logic in the views, serializers or the front end.


- [x] Products list should be responsive and be a single column on a phone. Each product variant should have it's own card in the list.

- [ ] Make a way to capture and display reviews. 

- [x] Order form should determine the number of items and should offer the choice of making the order a gift. Orders for the same product but different delivery details should be separate. For local delivery, the Customer should be able to enter special instructions.

- [ ] Gift packaging should be shown. The user should be able to see past gift receipts and offered the choice of reusing the same address without re-entring the details. 
  
- [ ] Delivery options should be shown: local delivery and shipping.

- [x] Shopping cart should show all the items desired, and allow deletion and edits. There should be an option to clear it.

- [ ] Checkout should include payment. Payment options should include Stripe, CoD (if we have to), and invoice at the end of the month. There should be a single payment transaction for all items in the shopping cart. The shopping cart should be cleared after checkout, orders and payments should be submitted to the backend 

- [ ] The frontend design should assume there will be multiple stores using the same logic. No branding should be hard-coded into the front end: All images, copy and assumptions about delivery area should depend on the store.

- [ ] Customers should be able to see and edit their account settings, e.g. address, email. They should be able to see their order history and account balance.

- [ ] Customers with subscriptions should be able to see and edit their expected deliveries. Orders on subscription should be invoiced.

- [ ] Customers who ask to be invoiced should receive an invoice for their current balance at the end of the month. They should be offered the option to settle their balance using Stripe.

Glorious Roadmap for Admin Experience Epic: The user should be able to perform all management and configuration step without directly accessing the database

- [ ] Admin should be able to see, edit and update information on Products, Customer Accounts, Marketing Campaigns, Deliveries, etc.

- [ ] The current Django template implementation will be retained until the Customer Experience Epic is completed, but the administrator interface should also be reimplemented using REST and React.

- [ ] People can and do create duplicate accounts. Switch to using email address for username, and make a tool the admin can use to merge and unmerge accounts. Unmerge is in case of a mistake.

- [ ] The admin should be able to see and edit Customer information, e.g. correct address and email.

Glorious Roadmap for Delivery Epic: The local delivery person(s) should have route planning and limited admin access. There should be a shipping delivery and charge.

- [ ] The local delivery person should be able to see the town.

- [ ] There should be an automated route planner for the local delivery person.

- [ ] It should be possible to have more than one delivery person and a way to allocate the deliveries among them.

- [ ] The local delivery person should not have full admin permissions.

Glorious Roadmap for Devops Epic:

- [ ] Currently the website is implemented directly on an EC2 instance, with dev and staging on the same instance but with routing dependent on nginx. This should be changed to use Docker containers implemented in Fargate.

- [ ] There is no CI/CD pipeline yet. This should be implemented using a serverless platform, e.g. CircleCI.

- [ ] There are no tests, no local test db, but there should be. Currently there is a prod and staging instance on RDS for UAT.

- [ ] Secrets are held in a file excluded from github. They should be stored in SSM.
