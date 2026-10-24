### First-Timer Detector (No-Fraud Version)

> Trigger condition: first comment

- Greets people on their first-ever comment, when they return after a long time (about 1 week), and on their first comment in that stream.
  - Detection uses OneComme's data.
  - Therefore, even if someone is not actually a "first-timer", they will be treated as one if there is no user information in the data. Thank you for your understanding.

#### How to Test in the Comment Tester

![](../../../images/usage-1792771550920.webp)

- In OmikujiBot v1.2 and later, you can test the "First-Timer Detector" by checking the following under "Other" in the Comment Tester.
  - `NEWコメント`: First-timer
  - `NEWコメント` + `再訪`: Welcome back (1 week or more since their last comment)
  - `再訪`: First comment in the stream
