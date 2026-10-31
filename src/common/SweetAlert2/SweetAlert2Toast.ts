// src/common/SweetAlert2/SweetAlert2Toast.ts
import Swal, { SweetAlertOptions } from 'sweetalert2'

// SweetAlert2 toast 通知の共通設定
const baseToastOptions: SweetAlertOptions = {
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
}

/**
 * toast API
 * swalToast.success({title:'内容',text:'内容'})
 */
export const swalToast = {
  success(options = {}) {
    return Swal.fire({
      ...baseToastOptions,
      icon: 'success',
      title: '成功しました',
      ...options,
    })
  },
  warning(options = {}) {
    return Swal.fire({
      ...baseToastOptions,
      icon: 'warning',
      title: '警告',
      ...options,
    })
  },

  error(options = {}) {
    return Swal.fire({
      ...baseToastOptions,
      icon: 'error',
      title: 'エラーが発生しました',
      ...options,
    })
  },

  info(options = {}) {
    return Swal.fire({
      ...baseToastOptions,
      icon: 'info',
      title: 'お知らせ',
      ...options,
    })
  },
}

/**
 * modal API
 * swalModal.error({title:'内容',text:'内容'})
 */
export const baseModalOptions: SweetAlertOptions = {
  icon: 'info',
  showCancelButton: false,
  confirmButtonText: 'OK',
  target: 'body',
}

export const swalModal = {
  error(options = {}) {
    return Swal.fire({
      ...baseModalOptions,
      icon: 'error',
      title: 'エラー',
      ...options,
    })
  },

  warning(options = {}) {
    return Swal.fire({
      ...baseModalOptions,
      icon: 'warning',
      title: '注意',
      ...options,
    })
  },

  info(options = {}) {
    return Swal.fire({
      ...baseModalOptions,
      icon: 'info',
      title: 'お知らせ',
      ...options,
    })
  },

  success(options = {}) {
    return Swal.fire({
      ...baseModalOptions,
      icon: 'success',
      title: '成功',
      ...options,
    })
  },

  confirmDelete(options: SweetAlertOptions = {}) {
    return Swal.fire({
      icon: 'warning',
      title: `削除しますか？`,
      text: 'この操作は取り消せません',
      showCancelButton: true,
      confirmButtonText: '削除する',
      cancelButtonText: 'キャンセル',
      ...options,
    })
  },

  /** 実行してよいかの確認 (結果の isConfirmed で判定) */
  confirm(options: SweetAlertOptions = {}) {
    return Swal.fire({
      icon: 'question',
      title: '確認',
      showCancelButton: true,
      confirmButtonText: '実行する',
      cancelButtonText: 'キャンセル',
      ...options,
    })
  },

  /** 文字列の入力 (入力値は結果の value、決定されたかは isConfirmed で判定) */
  prompt(options: SweetAlertOptions = {}) {
    return Swal.fire({
      input: 'text',
      showCancelButton: true,
      confirmButtonText: '決定',
      cancelButtonText: 'キャンセル',
      target: 'body',
      ...options,
    })
  },

  confirmTriple(options: SweetAlertOptions = {}) {
    return Swal.fire({
      icon: 'question',
      title: '確認',
      showConfirmButton: true,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: '上書きする',
      denyButtonText: 'マージする',
      cancelButtonText: 'キャンセル',
      ...options,
    })
  },
}
