// src/i18n/editor/apps/PackageMetaMessages.ts
// PackageBasicInfo / PackageSystemInfo / PackageDistributionInfo の labelKey / descriptionKey 用

export const packageMetaMessages = {
  ja: {
    packageMeta: {
      system: {
        latestVersionTitle: '最新バージョンを入手',
        appName: {
          label: 'アプリ名',
          description: 'パッケージの生成元アプリ',
        },
        appVersion: {
          label: 'アプリバージョン',
          description: 'アプリのバージョン',
        },
        dataVersion: {
          label: 'データバージョン',
          description: 'データのスキーマバージョン',
        },
      },
      distribution: {
        license: {
          label: 'ライセンス',
          description: 'omikujiData.js のライセンス。画像などは対象外です',
        },
        url: {
          label: '配布サイトURL',
          description: 'パッケージの配布サイトやプロジェクトページのURL',
          unset: '未設定',
        },
      },
      basic: {
        id: {
          description: 'プラグインでの保存名',
          regenerate: '再生成',
          confirmTitle: 'IDを変更しますか？',
          confirmText: '変更すると、パッケージIDを再生成します。',
          confirm: '変更する',
          cancel: 'キャンセル',
        },
        name: {
          label: 'パッケージ名',
          description: 'パッケージ（データ）の名前',
        },
        description: {
          label: 'パッケージ説明',
          description: '表示できる内容の概要',
        },
        version: {
          label: 'バージョン',
          description: 'パッケージのバージョン',
        },
        author: {
          label: '作者',
          description: 'パッケージの作成者',
        },
        tags: {
          label: 'タグ',
          description: 'パッケージの分類タグ',
        },
      },
    },
  },
  en: {
    packageMeta: {
      system: {
        latestVersionTitle: 'Get the latest version',
        appName: {
          label: 'App name',
          description: 'The app that generated this package',
        },
        appVersion: {
          label: 'App version',
          description: 'Version of this app',
        },
        dataVersion: {
          label: 'Data version',
          description: 'Schema version of this data',
        },
      },
      distribution: {
        license: {
          label: 'License',
          description: 'License of omikujiData.js. Images and other assets are not covered',
        },
        url: {
          label: 'Distribution URL',
          description: "URL of the package's distribution site or project page",
          unset: 'Not set',
        },
      },
      basic: {
        id: {
          description: 'Saved under this name in the plugin',
          regenerate: 'Regenerate',
          confirmTitle: 'Change the ID?',
          confirmText: 'Changing it will generate a new ID for this package.',
          confirm: 'Change',
          cancel: 'Cancel',
        },
        name: {
          label: 'Package name',
          description: 'Name of the package (data)',
        },
        description: {
          label: 'Package description',
          description: 'A concise description of what it can display',
        },
        version: {
          label: 'Version',
          description: 'Version information of the package',
        },
        author: {
          label: 'Author',
          description: 'Name of the package author',
        },
        tags: {
          label: 'Tags',
          description: 'Tags used to categorize the package',
        },
      },
    },
  },
} as const
