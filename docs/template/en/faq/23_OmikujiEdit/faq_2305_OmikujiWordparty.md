## Q. Playing WordParty when an omikuji is displayed

![](../../../../images/23_OmikujiEdit-1792765783947.webp)

- You can set this when the action type in "**Omikuji Settings**" is **"WordParty"**.
- When you enter text that matches the **"pattern"** set in any WordParty template, that WordParty's effect is triggered.
  - **Only the WordParty ID is supported**, and **it does not respond to pattern matching**.
  - For pattern specifications, see OneComme's official [How to read and configure the WordParty editor](https://onecomme.com/docs/feature/wordparty-editor).

### Where is the WordParty ID?

(TODO:ID の場所を文章でも説明する)

![|674x539](../../../../images/23_OmikujiEdit-1792765860095.webp)

### Notes When Configuring

- Each package comes with patterns already written to trigger the dedicated WordParty **"WordParty 2.0 for OmikujiBot"**.
  - If you change these patterns, **the intended effects may no longer trigger**.
  - They affect package-specific behavior such as character effects, speech bubble effects, and sound effects, so edit them carefully.
- If you want to add your own WordParty, we recommend setting a **unique pattern name** so it doesn't collide with existing patterns.
