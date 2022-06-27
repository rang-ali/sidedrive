<template>
  <div
    class="w-full h-full justify-center py-10 overflow-auto bg-gray-150"
  >
    <div class="flex items-center justify-center flex-col mb-10">
      <img src="/logo-horizontal.svg" class="h-[38px] mb-0.5 w-auto">
      <div class="opacity-60 text-[13px]">
        A better Google Drive experience.
      </div>
    </div>
    <div class="grid grid-cols-6 gap-8 w-11/12 max-w-4xl mx-auto">
      <!-- <div class="col-span-7 bg-white py-12 px-16 text-2xl leading-relaxed font-semibold">
        <div class="max-w-2xl">
          <span>Sidedrive adds a sidebar to your screen while using Google Drive apps.&nbsp;</span>
          <span class="opacity-50">This lets you stay more productive and allows you to move freely between different files without much of a context shift.</span>
        </div>
      </div> -->
      <!-- <div class="col-span-3 bg-white p-12 text-center">
        <img src="/favicon.svg" class="h-10 mb-5 mx-auto">
        <div class="text-2xl font-semibold mb-6">
          Start using Sidedrive now by signing in.
        </div>
        <div class="text-lg mb-20">
          The app will ask for read & write permissions to function properly.
        </div>
        <div class="btn bg-primary-500 text-white p-4 font-semibold rounded-md">Sign in with Google</div>
      </div> -->
      <div class="col-span-6 relative overflow-hidden">
        <div class="max-w-none relative" style="padding: 84% 0 0 0;">
          <img
            class="pointer-events-none absolute left-[-5%] top-[-5%] w-[115%] h-[115%] blur-md max-w-none"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAqCAMAAADGZPh1AAAC91BMVEX////+/v75+fn8/P32VkD3WEHp6er19fX8T0b5VED6VkD2VED2UT/6JSkvjc72Qjny9Pbx8fLw6Os7mNnqJEvyJT73JSz7+/vu7u7KIWTmJFDuJEjwJUP2Rj7w8PDw6OhlKGupHWmdHWnOIWLWIl7aI13jJFX3Pkr4Qkb6SEX4TUT7VED3TD/3ST72Tz33JTX4JS/0JCzs7Ozk5OQ9nN1YK2uBImtvJmp1JWqVHmq4H2jRIl/eI1vhJFn7S0f7UkP6Szr5JjD4+Pj9/PHu6OhAn+D99tw8ktOAptE1kNF9oMp+k7wZbrQAXa1eKWuHIWt6JGq7H2fFIGX5REb2Qj/7Uj76Tz3uTzrSQTP29vbn6e/9++05ltd+oc0uiskAg8kogMJ9lsAheb5bKmtpKGtsJ2t9I2uKIGuQH2qNH2q0HmmlHGmhHGnCIGb2OUr4PUX1JTnSODT6JALu7vDz7egBn+FJnt5Al9cDiM4zjMwAgccAaLRTLGtOLWpQLWmwHmmtHWnlJFP4Q0r2QED8VD/2Uz/vJDv3RzrzJDnyPDb5OTb4MzbTPDT6JS3H2/fz+PHt7e7x8u3n5ufy6OJAoeHh4ODy4907mtvc3Nr+9tU0lNUcjM8sh8ccdbpiKWuZHmq/IGfTIl/1OVHyMU73NUz2Pj7yRDj6QzjKIjj7LjbyJDPvJDC62v690fX++PSzzfPE1PHw6+yQvewDq+zMzOb++OHv5+Dq4tx2p9xonNcTjtMJic4AbrjgorUscK7FbpvBIGbqRWNgLluSKVm8JkfrJEX2RkP4Nz38JSj/Jhnr8/+kwOo4qemGsOE0nN5koNxPmNcnk9f/6Nbd0NVSl9Te6NOqtdCdr83Xvcxol8mAjsckhMXAu8TBocEAeMGTiMAAer0AcbtSgriyfq/kqa63eakXaam3lZ7nh5rseYSBJWvmQGfPW19xKl19KV2nKFTYIlSvJlHgI0/3L0z3J0r4M0b3PEH2PzvuUDrvSznTKCzTLCf9KBXn6HjUAAAELUlEQVRIx4XUd1gSYRzA8fe46y4EBCIFKzFtKCgjMCstDcKGTdoalu1pA7dtLbVhe+9danvvvffee++9649+70HjqYO+PPDcP5/n97uHuxc9u3dq3fHU6OjQ0NDoSZOi8YVMJktLS6uDq5eRMSshIaEDNHv27AZs6L1o4a4t6yalhk6V2Ww2mWwqfGRntm5N35aent4Ol5l588727f2hhmxo4YJ3hxc+SE1JDZXZZtSr5+np2bbttSt12eLjY+JjYmLi4ac9rj4bWrRo0YIPR/bcSjmZNsNJZnWIW7lyrJzHEDxSTvyMJBi5mYFQb9yCAtGu0yl1bA6RsDNuytkLYxkaAUK/M/CkCggF4voEBh7ZczVl5syZnhkZbYEgkiC5ksMXZWVlBQUF9ekTWDDqxtrN5z23ZWbefhgnlyMc4chMOi8Qm6oZxKJD33csX3Vs7YnNW+7GPTpH07TR6FyLR6A/i4xURapUALOzP9ofr18+ZvWKVZeUaxg5DyJdkMji6ki1SuXbvHmQPWvH+jFjVl9UImecpLgjtUrj23xx0Ej7oSf3L19XIuK/JCpKHQIme/HBkXZ70fM1iCTdkijII0qtDvGFQZ+yD4745kcbacIl4QcPC+azCVkjFotH9PMzM7GkSxLM9/Dgs0ggxMv5ssRA0zyXpMWwYA+I78EXDBdqtZrcXEwkSqnrKS2xwVEUNVyrDamZq1kCxKBELklNMHi5YsUoCs8J0WiWjPaTSMcpSFdkaU1AYIpBlEAAJgQIMz7JYIZHkJOMGsmiFhQQjIRC7ZfRJdpMl0wz0i6eMW+9CauWWgH107Qa7VertiQ52UCbOUmlSt7e3vkFYk1LAUYUmFatSwCZsjGJZhDBSTASifSjcoWUw3xuDYtJp0wcp+S+/cJCIGAgk3g4CEqAp2yQTEyWSBkmliH/ITk5eYU6vd6ULxIdFunFQiCOxTZOlComTKAnxCLiL3KgTI6XV15fnU5nMplEGGHSprbUMF5h4F6sVMnSpcuU8fLy6tsXnCk/Xy92LDZ+rFTBg/f9X1JxaKlSJTFjXZ5Op/cu6odvf9OmJCPNOaVC9RoVWQYOIEzLK/oKizHTJo+Tci8WUb48qBrgfo3LWQa3b542OYnhJj7lIuaXB1ahenXsMDuwLPnoCgWtNMZyk91NfXzKQQAdruLQt8ssiEfCeUxykx7h1t2JiYkAQYID9nq/BZFuThj/IYN7hIdbrdZ58xKb4okRERH7LcrJ8A+6IgG9evb09x8yZPDgHpiC82n6xoLkhOsp3apVmxsQENCrF6bsSGv4K4vb0zKscdeu3bt3AwkWKDj/fRa3p2XVJk26dAkLC2vcGCxQ7PbRbkmnzp2rVKkKYYolzHzpnjRqNKcs1MlJAT4Ne+GeVMZ1hMBiCbDKXvdkIDQIGgCBZaF78gNE4Wg90SM/cAAAAABJRU5ErkJggg==" />
          <div
            ref="primaryVideo"
            class="pointer-events-none absolute left-0 top-0 h-full w-full"
          >
          </div>
        </div>
        <div class="max-w-[270px] absolute left-10 bottom-16 text-white text-3xl font-bold leading-snug">
          <span>Sidedrive adds a sidebar to your screen while using Google&nbsp;Drive. </span>
          <span class="opacity-60">Enabling you to move smoothly across your files.</span>
        </div>
      </div>
      
      <div class="col-span-3 bg-white p-14">
        <div class="text-3xl font-semibold mb-4">Secure by design</div>
        <div class="text-lg leading-relaxed text-gray-700">
          Sidedrive is engineered to protect your privacy by default. That's why Sidedrive is built to function without its own server - making it impossible for us to come across any sensitive information. All file data transfers - requests and responses, is between <span class="font-medium text-black">you and Google only</span>.
          <br>
          <br>
          For more details read our <a href="/privacy-policy.pdf" target="_blank" class="text-primary font-medium hover:underline cursor-pointer">Privacy Policy</a>.
        </div>
      </div>
      <div class="col-span-3 overflow-hidden relative">
        <div class="relative" style="padding: 116.67% 0 0 0;">
          <img
            class="pointer-events-none absolute left-[-5%] top-[-5%] w-[115%] h-[115%] blur-sm max-w-none"
            src="data:image/png;base64,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"
          />
          <div
            ref="secondaryVideo"
            class="absolute left-0 top-0 w-full h-full pointer-events-none"
          >
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center flex-col mt-20">
      <img src="/logo-horizontal.svg" class="h-[38px] mb-1 w-auto">
      <div class="opacity-80 text-xs">
        A better Google Drive experience.
      </div>
      <div class="opacity-80 text-xs mt-4">
        Made by <a class="text-primary-500 font-medium dark:text-primary-500 border-b border-transparent hover:border-primary-500 hover:text-primary-500 transition-colors leading-normal text-medium" href="https://twitter.com/rang_ali" target="_blank" tabindex="-1">@rang_ali</a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import useStore from '@/store';

const primaryVideo = ref(null);
const secondaryVideo = ref(null);

const options = {
  autoplay: true,
  autopause: false,
  keyboard: false,
  byline: false,
  controls: false,
  dnt: true,
  loop: true,
  muted: true,
  playsinline: true,
  portrait: true,
  responsive: true,
  title: false,
};

let primaryVimeo;
let secondaryVimeo;

onMounted(() => {
  primaryVimeo = new Vimeo.Player(primaryVideo.value, { ...options, id: 615259071 });
  secondaryVimeo = new Vimeo.Player(secondaryVideo.value, { ...options, id: 615275658 });
});

const { showSignIn } = useStore();
watch(showSignIn, (v) => {
  if (v) {
    primaryVimeo?.pause();
    secondaryVimeo?.pause();
  } else {
    primaryVimeo?.play();
    secondaryVimeo?.play();
  }
})

</script>