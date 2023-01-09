            # import stripe

            #    stripe.api_key = settings.STRIPE_SECRET_KEY
            #     checkout_session = stripe.checkout.Session.create(
            #         customer_email=user.email,
            #         payment_method_types=["card"],
            #         line_items=[
            #             {
            #                 "price_data": {
            #                     "currency": currency,
            #                     "product_data": {
            #                         "name": memberhip_obj.name,
            #                     },
            #                     "unit_amount": int(amount) * 100,
            #                 },
            #                 "quantity": 1,
            #             }
            #         ],
            #         mode="payment",
            #         # success_url=request.build_absolute_uri(
            #         #     reverse('success')
            #         # ) + "?session_id={CHECKOUT_SESSION_ID}",
            #         # cancel_url=request.build_absolute_uri(reverse('failed')),
            #         success_url=f"http://localhost:3001/plans?success=true",
            #         cancel_url=f"http://localhost:3001/plans?success=false",
            #     )
            #     # Save the order in DB
            #     order = Order.objects.create(
            #         user=user,
            #         amount=amount,
            #         membership=memberhip_obj,
            #         membership_plan=memberhip_obj.name,
            #         currency=currency,
            #         gateway="stripe",
            #         stripe_payment_intent=checkout_session["payment_intent"],
            #         stripe_session_id=checkout_session.id,
            #     )
            #     context = {}
            #     context["sessionId"] = checkout_session.id
            #     context["stripe_publishable_key"] = settings.STRIPE_PUBLISHABLE_KEY
            #     return Response({"result": context})