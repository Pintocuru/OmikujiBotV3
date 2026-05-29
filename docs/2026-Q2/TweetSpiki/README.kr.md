# OmikujiBOT 인사하는 스피키 OmikujiBot TweetSpiki

최종 업데이트：2026/04/29

배신자를 위한 댓글 앱 「OneComme」에서 사용할 수 있는 템플릿입니다.

이 내용은 BOOTH 에서 배포하는 아래 항목의 README 입니다.

- [おみくじBOT 配信向けｽﾋﾟｷ OmikujiBot TweetSpiki](https://pintocuru.booth.pm/items/8281244)
- [OmikujiBOT 방송용 스피키 OmikujiBot TweetSpiki](https://pintocuru.booth.pm/items/8281303)

## 시작하기 (Intro)

- [OneComme](https://onecomme.com/) 기능을 전제로 한 소프트웨어입니다.
- 본 소프트웨어의 사용은 사용자 본인의 책임 하에 이루어집니다.
- 사양은 예고 없이 변경될 수 있습니다.

## 이 템플릿은 무엇인가요? (Features)

### 스피키가 왁야야! 하는 제너레이터

- OneComme 에 BOT 기능을 부여하는 제너레이터【OmikujiBOT】를 사용한, 스피키가 인사를 하는 템플릿입니다.
- 시청자가 댓글을 달면, 「처음 오셨군요!」나 「◯◯님, 안녕하세요!」라고 자동으로 답장해 줍니다.
- 방송 상태 (좋아요 수·동시 접속자 수·구독자 수 등) 를 랜덤으로 표시합니다.
- 채널 구독 등의 안내도 표시할 수 있습니다. 내용은 에디터에서 자유롭게 편집할 수 있습니다.

### 씬별 활용 예시

- **아침 방송**
  - 오늘 하루의 운세를 점치는 「오미쿠지」로 방송이 활기차게.
- **잡담 방송**
  - 시청자의 댓글에 캐릭터가 개그를 치거나 리액션을 하며 자연스럽게 대화가 이어집니다.
- **게임 방송**
  - 게임에 집중하고 있어도 BOT 가 대신 인사해 주므로 처음 온 시청자를 놓치지 않습니다.

### 스피키 캐릭터 설정

![](images/Pasted%20image%2020260429134321.png)

이 제너레이터에서는 스피키 다음과 같은 캐릭터로 등장시키고 있습니다.

- 귀엽고 애완동물 같은 분위기를 내기 위해 짧은 문장으로 구성했습니다.

## 설치 방법 (Installation)

> ⚠️ 현재 FAQ 페이지는 일본어로만 제공됩니다.

1. [템플릿 설치 방법](https://github.com/Pintocuru/OmikenReadme/blob/main/docs/TemplateInstall/README.md)
2. [오미쿠지 BOT 업그레이드](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/installation/Installation_52_VersionUp.md)
3. [【권장】오미쿠지 BOT 연출용 WordParty2.0 도입 방법](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/OmikenWordParty/README.md#%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E6%96%B9%E6%B3%95-installation)
	- [오미쿠지 BOT 연출용 WordParty2.0이란?](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/OmikenWordParty/README.md#%E3%81%93%E3%81%AE%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E3%81%AF%E4%BD%95features)
4. [오미쿠지 BOT 컨피그 에디터 PRO (유료판) 안내](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/installation/Installation_51_ProUpgradeTemplate.md)

## 사용 방법 (Usage)

### 오미쿠지를 발동시키려면

![](../../template/usage/images/92_OmikujiActivation.webp)

- 방송에서 실제로 사용하기 전에, **OneComme 의 댓글 테스터로 동작 확인**하는 것을 권장합니다.
- 댓글 테스터는 OneComme 메뉴에서 「댓글 테스터」를 선택해 이용하세요.
- OBS 등의 스트리밍 앱에 올바르게 설치되어 있다면, 댓글에 「오미쿠지」 등의 키워드를 입력하면 발동됩니다.

### 처음 방문 판정 기능

> 발동 조건: 첫 댓글

- 처음 댓글, 오랜만 (약 1 주일 만) 의 방문, 해당 방송에서의 첫 댓글에 대해 인사합니다.
	- 판정에는 「OneComme」의 데이터를 참조합니다.
	- 따라서 실제로는 「처음」이 아니더라도, 데이터에 유저 정보가 없으면 「처음」으로 판정됩니다. 양해 부탁드립니다.

#### 댓글 테스터에서의 테스트 방법

![](../../template/usage/images/22_FirstCounter.png)

- OmikujiBOT v1.2 이상에서는, 댓글 테스터의 「기타」 항목에서 아래에 체크를 넣으면 「처음 방문 판정」 테스트가 가능합니다.
	- `NEW 댓글`: 처음
	- `NEW 댓글` + `재방문`: 오랜만 (이전 댓글로부터 1 주일 이상 경과)
	- `재방문`: 해당 방송에서의 첫 댓글

### 선물 (후원) 에 대한 감사

> 발동 조건: 1 포인트 이상의 슈퍼챗·선물·비트·오차바쿠 등

- 선물에 대해 BOT 댓글을 표시할 수 있습니다.
- 선물에 대한 리액션은 OneComme 의 선물용 읽기 기능이나 WordParty 기능으로 다양한 연출이 가능하므로, 기본 설정은 간소하게 되어 있습니다.

### 댓글 수 체크 (방송 내·개인 누계)

> 발동 조건: 방송 내 50 댓글마다, 개인 100 댓글마다

- 방송 내 댓글 수와 개인 누적 댓글 수를 참조하여, 특정 횟수에 BOT 가 댓글을 남겨줍니다.
- 기본값으로는 50 회 또는 100 회마다 안내 토스트를 표시합니다.

### 댓글 수 확인하기

> 발동 키워드: `댓글`

- 지금까지 작성한 댓글 수를 OneComme 가 실행된 방송 범위 내에서 집계하여 토스트 알림으로 표시합니다.

## 커스터마이징 (Customization)

### 「컨피그 에디터」로 오미쿠지를 자유롭게 편집

![](../../core/ConfigEditor/images/features-04.webp)

- 일부 배포 패키지에는 **컨피그 에디터**(오미쿠지 데이터 편집용 앱) 가 포함되어 있습니다.
	- 포함되어 있지 않은 경우, 새로 도입해야 합니다. [컨피그 에디터 신규 도입](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/installation/Installation_52_VersionUp.md) 을 참조하세요.
- 앱과 같은 폴더에 있는 **`ConfigMaker.html`** 을 열면 실행됩니다.
- 자세한 내용은 [오미쿠지 BOT 컨피그 에디터 README](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/README.md) 를 참조하세요.
	- ⚠️ 현재 일본어로만 제공됩니다.

## 자주 묻는 질문 (FAQ)

> OneComme 기능에 대해서는 [자주 묻는 질문](https://onecomme.com/docs/faq) 또는 [도입 가이드](https://onecomme.com/docs/guide) 를 참조하세요.
> ⚠️ 현재 FAQ 페이지는 일본어로만 제공됩니다.

### 발동 조건·제한 설정

- [Q. 선물·슈퍼챗이 왔을 때만 발동시키고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2101_Gift.md)
- [Q. 멤버 한정으로 발동시키고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2102_Member.md)
- [Q. 하루 1회로 횟수를 제한하고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2103_Limit.md)
- [Q. 같은 사람이 여러 번 오미쿠지를 하는 것이 곤란하다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2106_LimitOne.md)
- [Q. 방송자를 오미쿠지에서 제외하려면?](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2104_Owner.md)
- [Q. 특정 오미쿠지를 일시적으로 끄고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2105_OffOmikuji.md)
- [Q. 특정 유저를 제한하고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2107_LimitOther.md)

### 말풍선·캐릭터 표시 관련

> 캐릭터 취급에 대해서는 각 패키지마다 다릅니다.

- [Q. 말풍선 색을 변경하고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2201_BubbleColor.md)
- [Q. 캐릭터를 표시하고 싶다 / 캐릭터를 없애고 말풍선만 표시하고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2202_BubbleOnly.md)
- [Q. 우측 하단 아이콘을 없애고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2203_Thumbnail.md)
- [Q. 토스트를 왼쪽에서 표시하고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2204_ToastLeft.md)
- [Q. 글자·캐릭터 크기를 조정하고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2205_FontBig.md)
- [Q. 직접 만든 캐릭터 이미지를 추가하고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2206_MyCharacter.md)
- [Q. 오미쿠지 결과에 표시되는 캐릭터·아이콘을 변경하고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2207_CharacterChange.md)
- [Q. 제너레이터에서 표시하는 캐릭터를 변경하기](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2208_AlwaysCharacter.md)

### 오미쿠지 내용·확률 설정 (콘텐츠 편집)

- [Q. 오미쿠지 내용을 변경하고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/23_OmikujiEdit/faq_2301_OmikujiValue.md)
- [Q. 오미쿠지가 나오는 확률을 변경하고 싶다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/23_OmikujiEdit/faq_2302_Omikujilottery.md)
- [Q. 에디터에서 오미쿠지 동작을 확인하려면](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/23_OmikujiEdit/faq_2303_OmikujiConfirmation.md)
- [Q. 플레이스홀더로 오미쿠지 변형을 늘리기](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/sub/ContentPlaceholder.md)
- [Q. 플레이스홀더 치트시트](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/sub/ContentPlaceholderCheatSheet.md)
- [Q. 평가 블록 (변수 플레이스홀더)이란](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/sub/VariablePlaceholder.md)
- [Q. 평가 블록 (변수 플레이스홀더) 치트시트](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/sub/VariablePlaceholderCheatSheet.md)
- [Q. 오미쿠지 표시 시 사운드를 재생하기](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/23_OmikujiEdit/faq_2304_OmikujiSound.md)
- [Q. 오미쿠지 표시 시 WordParty를 재생하기](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/23_OmikujiEdit/faq_2305_OmikujiWordparty.md)

## 문제 해결 (Troubleshooting)

OneComme 기능에 대해서는 [문제 해결](https://onecomme.com/docs/trouble-shooting) 또는 [도입 가이드](https://onecomme.com/docs/guide) 를 참조하세요.

### 설정·표시·음성 관련

- [Q. OBS에서 숨김 처리해도 BOT 댓글이 멋대로 움직인다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/troubleshooting/12_infoOmikujiBot/trouble_1202_OBSSound.md)
- [Q. 캐릭터 이미지가 표시되지 않는다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/troubleshooting/12_infoOmikujiBot/trouble_1203_CharacterImage.md)
- [Q. WordParty 소리가 방송에 나오지 않는다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/troubleshooting/12_infoOmikujiBot/trouble_1206_infoWordParty.md)

### 오미쿠지 관련

- [Q. 댓글로 오미쿠지가 반응하지 않는다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/troubleshooting/12_infoOmikujiBot/trouble_1204_CommentOmikuji.md)
- [Q. 오미쿠지가 YouTube 댓글에 반영되지 않는다](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/troubleshooting/12_infoOmikujiBot/trouble_1205_OmikujiPlatform.md)

## 크레딧 (Credits)

### 스피키 일러스트

- 팬아트: せすじピンとしてます
- 본 앱 전용으로 제작된 이미지입니다. 다른 용도로의 사용·전재·재배포를 금지합니다.

#### 음성

- ｽﾋﾟｷ MAD でよく使われるボイス集 <https://www.youtube.com/watch?v=iBOuJ5x294o>

## 라이선스 (License)

### 패키지 데이터

- 이 패키지의 데이터 (JSON 데이터) 는 개변·재사용을 자유롭게 할 수 있습니다.
- 단, **재배포는 금지**합니다.
- 본 템플릿 사용에 따른 어떠한 손해에 대해서도 책임을 지지 않습니다. 이용은 본인 책임 하에 해주시기 바랍니다.

### 앱 본체 (제너레이터·컨피그 에디터)

- Copyright © 2023-2026 Pintocuru(せすじピンとしてます)
- 본 소프트웨어 (오미쿠지 BOT) 는 저작권자의 허가 없이 재배포하는 것을 금지합니다.
- 본 소프트웨어는 Github 또는 BOOTH 에서 제공되는 각 패키지에 포함된 형태로만 배포됩니다.
- 개변·역컴파일·재판매도 금지되어 있습니다.

## 버전 정보 (Version)

### ver.260429

- **OmikujiBOT**: v2.13.3
- 신규 작성

---

作成者：Pintocuru(せすじピンとしてます) @pintocuru

[Twitter](https://twitter.com/pintocuru) | [YouTube](https://www.youtube.com/@pintocuru)

<%* await tp.user.expandEmbeds(tp,'kr') %>