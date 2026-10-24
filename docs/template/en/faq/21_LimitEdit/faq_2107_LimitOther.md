## Q. I want to restrict specific users

Use this when you don't want to block someone (such as the streamer) in OneComme, but you don't want omikuji to trigger for them.

1. In OmikujiBot Editor, open Comment Events > Trigger Settings.
2. Under "Trigger Condition to Apply", select "User Name".
3. Enter the user name you want to apply it to.
   1. It uses regular-expression matching. To restrict users, put `!` at the beginning to make it a negative match.
   2. You cannot specify users by the `userId` used in OneComme.
   3. If it is not a negative match, it applies "to that user only".
   4. To filter by attribute, such as streamer or moderator, see [Q. I want it to trigger for members only](./faq_2102_Member.md).
