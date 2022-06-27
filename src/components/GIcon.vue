<template>
  <svg
    v-bind="iconProps"
    v-html="iconBody"
  />
</template>

<script setup>

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};

const icons = {
  chevronRight: {
    'stroke-width': 2.5,
    body: '<path d="M9 18l6-6-6-6"/>',
  },
  folder: {
    fill: 'currentColor',
    stroke: 'none',
    body: '<g><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path><path d="M0 0h24v24H0z" fill="none"></path></g>'
  },
  folderShared: {
    fill: 'currentColor',
    stroke: 'none',
    body: '<g><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8h-8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z"></path><path d="M0 0h24v24H0z" fill="none"></path></g>',
  },
  folderHiDef: {
    viewBox: '0 0 128 128',
    body: '<g><path fill="currentColor" d="M128.145,47.954V24.681c0-1.926-1.562-3.49-3.491-3.49H48.932 c0,0-1.563-8.146-3.491-8.146H3.491C1.563,13.045,0,14.608,0,16.536v8.145v2.328v20.945"></path><path fill="#000" opacity="0.33" d="M128.145,47.954V24.681c0-1.926-1.562-3.49-3.491-3.49H48.932 c0,0-1.563-8.146-3.491-8.146H3.491C1.563,13.045,0,14.608,0,16.536v8.145v2.328v20.945"></path><path fill="currentColor" d="M120,32.827H8.145C3.647,32.827,0,36.474,0,40.973v67.491 c0,1.929,1.563,3.491,3.491,3.491h121.162 c1.929,0,3.491-1.562,3.491-3.491V40.973C128.145,36.474,124.498,32.827,120,32.827z"></path></g>',
    stroke: 'none',
    fill: 'currentColor',
  },
  folderSharedHiDef: {
    viewBox: '0 0 128 128',
    body: '<g><path fill="currentColor" d="M128.145,47.954V24.681c0-1.926-1.562-3.49-3.491-3.49H48.932 c0,0-1.563-8.146-3.491-8.146H3.491C1.563,13.045,0,14.608,0,16.536v8.145v2.328v20.945"></path><path fill="#000" opacity="0.33" d="M128.145,47.954V24.681c0-1.926-1.562-3.49-3.491-3.49H48.932 c0,0-1.563-8.146-3.491-8.146H3.491C1.563,13.045,0,14.608,0,16.536v8.145v2.328v20.945"></path><path fill="currentColor" d="M120,32.827H8.145C3.647,32.827,0,36.474,0,40.973v67.491 c0,1.929,1.563,3.491,3.491,3.491h121.162 c1.929,0,3.491-1.562,3.491-3.491V40.973C128.145,36.474,124.498,32.827,120,32.827z"></path></g><g fill="#FFFFFF"><path d="M53.704,73.358c-5.611,0-17.454,2.857-17.454,8.566v7.856 h34.688v-7.856C70.938,76.216,59.314,73.358,53.704,73.358z"></path><path d="M54.387,68.75c4.667,0,8.457-3.829,8.457-8.562c0-4.729-3.79-8.562-8.457-8.562 c-4.673,0-8.461,3.834-8.461,8.562C45.926,64.922,49.717,68.75,54.387,68.75z"></path><g opacity="0.66"><path d="M91.75,79.118c0-5.227-10.301-7.837-15.273-7.837c-3.342,0-8.493,0.838-10.489,2.025 c4.26,1.278,7.263,4.335,7.263,6.937v6.069h18.5V79.118z"></path><path d="M75.924,67.725c4.115,0,7.455-3.377,7.455-7.55c0-4.168-3.343-7.546-7.455-7.546 c-4.119,0-7.459,3.378-7.459,7.546C68.465,64.348,71.805,67.725,75.924,67.725z"></path></g></g>',
    stroke: 'none',
    fill: 'currentColor',
  },
  more: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
    stroke: 'none',
    fill: 'currentColor',
  },
  image: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M21 21V3H3v18h18zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>',
    stroke: 'none',
    fill: 'currentColor',
  },
  newWindow: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>',
    stroke: 'none',
    fill: 'currentColor',
  },
  copy: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 7h11v14H8z" opacity=".25"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>',
    stroke: 'none',
    fill: 'currentColor',
  },
  download: {
    body: '<g><rect fill="none" height="24" width="24"/></g><g><path fill="currentColor" d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"/></g>',
    stroke: 'none',
    fill: 'currentColor',
  },
  remove: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 9h8v10H8z" opacity=".25"/><path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"/>',
    stroke: 'none',
    fill: 'currentColor',
  },
  spinner: {
    body: '<line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>',
    'stroke-width': 2.25,
  },
  plus: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  roundPlus: {
    body: '<rect width="256" height="256" fill="none"></rect><path d="M128,23.99805a104,104,0,1,0,104,104A104.12041,104.12041,0,0,0,128,23.99805Zm40,112H136v32a8,8,0,1,1-16,0v-32H88a8,8,0,0,1,0-16h32v-32a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z"></path>',
    viewBox: '0 0 256 256',
    fill: 'currentColor',
    stroke: 'none',
  },
  avatar: {
    body: '<path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  chevronsLeft: {
    body: '<g><rect fill="none" height="24" width="24"/></g><g><g><polygon points="17.59,18 19,16.59 14.42,12 19,7.41 17.59,6 11.59,12"/><polygon points="11,18 12.41,16.59 7.83,12 12.41,7.41 11,6 5,12"/></g></g>',
    stroke: 'none',
    fill: 'currentColor',
  },
  cog: {
    body: '<g><path d="M0,0h24v24H0V0z" fill="none"/><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></g>',
    stroke: 'none',
    fill: 'currentColor',
    viewBox: '-2 -2 28 28',
  },
  logout: {
    body: '<path d="M0 0h24v24H0z" fill="none"/><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>',
    stroke: 'none',
    fill: 'currentColor',
  },
  google: {
    body: '<path d="M326.331 274.255v109.761h181.49c-7.37 47.115-54.886 138.002-181.49 138.002-109.242 0-198.369-90.485-198.369-202.006 0-111.509 89.127-201.995 198.369-201.995 62.127 0 103.761 26.516 127.525 49.359l86.883-83.635C484.99 31.512 412.741-.012 326.378-.012 149.494-.012 6.366 143.116 6.366 320c0 176.884 143.128 320.012 320.012 320.012 184.644 0 307.256-129.876 307.256-312.653 0-21-2.244-36.993-5.008-52.997l-302.248-.13-.047.024z"></path>',
    stroke: 'none',
    fill: 'currentColor',
    viewBox: '0 0 640 640',
  },
  star: {
    body: '<g><path d="M0,0h24v24H0V0z" fill="none"/><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><polygon opacity=".25" points="12,15.4 8.24,17.67 9.24,13.39 5.92,10.51 10.3,10.13 12,6.1 13.71,10.14 18.09,10.52 14.77,13.4 15.77,17.68"/><path d="M22,9.24l-7.19-0.62L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27L18.18,21l-1.63-7.03L22,9.24z M12,15.4l-3.76,2.27 l1-4.28l-3.32-2.88l4.38-0.38L12,6.1l1.71,4.04l4.38,0.38l-3.32,2.88l1,4.28L12,15.4z"/></g></g>',
    stroke: 'none',
    fill: 'currentColor',
  },
  edit: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 18.08V19h.92l9.06-9.06-.92-.92z" opacity=".3"/><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  fileCopy: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M14 7H8v14h11v-9h-5z" opacity=".3"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zm4 16H8V7h6v5h5v9z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  enter: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7h-2z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  restore: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 3c-4.97 0-9 4.03-9 9H1l4 3.99L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  loadMore: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  enter: {
    body: '<path d="M10 9l-6 6 6 6"/><path d="M20 4v7a4 4 0 0 1-4 4H5"/>',
    'stroke-width': 2.5,
  },
  warning: {
    body: '<path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  close: {
    body: '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  search: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  recent: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  trash2: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  star2: {
    body: '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  drive: {
    body: '<g><rect fill="none" height="24" width="24" x="0"/></g><g><g><path d="M19,11c0.17,0,0.33,0.01,0.49,0.02L15,3H9l5.68,9.84C15.77,11.71,17.3,11,19,11z"/><polygon points="8.15,4.52 2,15.5 5,21 11.33,10.03"/><path d="M13.2,15.5H9.9L6.73,21h7.81C13.58,19.94,13,18.54,13,17C13,16.48,13.07,15.98,13.2,15.5z"/><polygon points="20,16 20,13 18,13 18,16 15,16 15,18 18,18 18,21 19,21 20,21 20,18 23,18 23,16"/></g></g>',
    fill: 'currentColor',
    stroke: 'none',
  },
  shared: {
    body: '<g><rect fill="none" height="24" width="24"/></g><g><g/><g><path d="M16.67,13.13C18.04,14.06,19,15.32,19,17v3h4v-3C23,14.82,19.43,13.53,16.67,13.13z"/><path d="M15,12c2.21,0,4-1.79,4-4c0-2.21-1.79-4-4-4c-0.47,0-0.91,0.1-1.33,0.24C14.5,5.27,15,6.58,15,8s-0.5,2.73-1.33,3.76 C14.09,11.9,14.53,12,15,12z"/><path d="M9,12c2.21,0,4-1.79,4-4c0-2.21-1.79-4-4-4S5,5.79,5,8C5,10.21,6.79,12,9,12z M9,6c1.1,0,2,0.9,2,2c0,1.1-0.9,2-2,2 S7,9.1,7,8C7,6.9,7.9,6,9,6z"/><path d="M9,13c-2.67,0-8,1.34-8,4v3h16v-3C17,14.34,11.67,13,9,13z M15,18H3l0-0.99C3.2,16.29,6.3,15,9,15s5.8,1.29,6,2V18z"/></g></g>',
    fill: 'currentColor',
    stroke: 'none',
  },
  lock: {
    body: '<g fill="none"><path d="M0 0h24v24H0V0z"/><path d="M0 0h24v24H0V0z" opacity=".87"/></g><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
  check: {
    body: '<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>',
    fill: 'currentColor',
    stroke: 'none',
  },
};

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: null,
  },
});

const iconProps = {
  ...base,
  ...icons[props.name],
  body: undefined,
  height: props.size,
  width: props.size,
}

const iconBody = icons[props.name].body;

</script>
