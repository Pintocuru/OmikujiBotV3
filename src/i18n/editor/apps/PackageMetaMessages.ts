// src/i18n/editor/apps/PackageMetaMessages.ts
// PackageBasicInfo / PackageSystemInfo / PackageDistributionInfo の labelKey / descriptionKey 用

export const packageMetaMessages = {
  ja: {
    packageMeta: {
      system: {
        latestVersionTitle: '最新バージョンを入手する',
        appName: {
          label: 'アプリ名',
          description: 'このパッケージを生成したアプリ名',
        },
        appVersion: {
          label: 'アプリバージョン',
          description: 'このアプリのバージョン',
        },
        dataVersion: {
          label: 'データバージョン',
          description: 'このデータのスキーマバージョン',
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
          description: 'プラグインでは、この名称で保存されます',
          regenerate: '再生成',
          confirmTitle: 'IDを変更しますか？',
          confirmText: '変更すると、このパッケージのIDが新しく生成されます。',
          confirm: '変更する',
          cancel: 'キャンセル',
        },
        name: {
          label: 'パッケージ名',
          description: 'パッケージ(データ)の名称',
        },
        description: {
          label: 'パッケージ説明',
          description: 'どんな内容を表示できるかを端的に説明',
        },
        version: {
          label: 'バージョン',
          description: 'パッケージのバージョン情報',
        },
        author: {
          label: '作者',
          description: 'パッケージの作成者名',
        },
        tags: {
          label: 'タグ',
          description: 'パッケージの分類に使用されるタグ',
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
