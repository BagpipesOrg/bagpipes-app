import React from 'react';
import './Icons.scss'


  export const EditIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="white" viewBox="0 0 512 512">
      <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0z"></path>
      <path d="M291.7 90.3L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"></path>
    </svg>
  );

  export const PlusIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="create-ui" fill="white" height="1em" viewBox="0 0 448 512">
        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
    </svg>
  );

  export const PlayIcon = () => (
<svg width="44" height="52" viewBox="0 0 44 52"  className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.21 0C6.03165 0.00265006 3.94343 0.869854 2.40405 2.41112C0.864658 3.95238 -1.58938e-06 6.04165 2.25749e-08 8.22V43.78C-0.000109379 45.2555 0.397418 46.7038 1.15077 47.9724C1.90412 49.2411 2.98545 50.2833 4.28102 50.9894C5.57658 51.6955 7.0385 52.0395 8.51299 51.985C9.98748 51.9306 11.42 51.4798 12.66 50.68L40.22 32.9C41.3738 32.156 42.3226 31.1346 42.9797 29.9292C43.6367 28.7238 43.9809 27.3729 43.9809 26C43.9809 24.6271 43.6367 23.2762 42.9797 22.0708C42.3226 20.8654 41.3738 19.844 40.22 19.1L12.66 1.32C11.335 0.460075 9.78959 0.00166187 8.21 0ZM38 26C38.0027 26.369 37.9125 26.7328 37.7378 27.0578C37.563 27.3829 37.3093 27.6587 37 27.86L9.41 45.64C9.07601 45.856 8.68992 45.9778 8.29246 45.9926C7.895 46.0075 7.5009 45.9148 7.15173 45.7243C6.80256 45.5339 6.51126 45.2527 6.30856 44.9105C6.10585 44.5683 5.99925 44.1777 6 43.78V8.22C5.99925 7.82227 6.10585 7.4317 6.30856 7.08949C6.51126 6.74729 6.80256 6.46613 7.15173 6.27568C7.5009 6.08522 7.895 5.99252 8.29246 6.00736C8.68992 6.02221 9.07601 6.14403 9.41 6.36L37 24.14C37.3093 24.3413 37.563 24.6171 37.7378 24.9422C37.9125 25.2672 38.0027 25.631 38 26Z" fill="white"/>
</svg>
  );

  export const EyeIcon = () => (
    <svg width="103" height="60" viewBox="0 0 103 60"  className="h-6 w-6"  xmlns="http://www.w3.org/2000/svg">
    <path d="M99.8221 22.888C99.0411 21.953 80.3291 0 51.0951 0C21.8641 0 3.15212 21.954 2.36912 22.889C-0.789875 26.665 -0.789875 32.808 2.37013 36.585C3.15113 37.52 21.8631 59.473 51.0951 59.473C80.3281 59.473 99.0401 37.519 99.8231 36.584C102.982 32.808 102.982 26.664 99.8221 22.888ZM69.2491 29.737C69.2491 39.746 61.1051 47.889 51.0961 47.889C41.0871 47.889 32.9431 39.746 32.9431 29.737C32.9431 19.727 41.0871 11.584 51.0961 11.584C61.1051 11.584 69.2491 19.727 69.2491 29.737Z" fill="white"/>
    <path d="M40.7402 29.7359C40.7402 35.4459 45.3862 40.0919 51.0962 40.0919C56.8062 40.0919 61.4522 35.4469 61.4522 29.7359C61.4522 24.0249 56.8072 19.3809 51.0962 19.3809C45.3852 19.3809 40.7402 24.0259 40.7402 29.7359Z" fill="white"/>
    </svg>
  );

  export const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="white"  height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
  )

  export const iIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="#5e5e5e" viewBox="0 0 192 512"><path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z"/></svg>
  )

  export const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="white"  viewBox="0 0 512 512"><path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/></svg>
  )

  export const BroadcastIcon = () => (
<svg width="56" height="54" viewBox="0 0 56 54" className="create-ui" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 18.65C0 25.35 2.7 31.75 7.4 36.55C8.4 37.55 10 37.55 11 36.55C12 35.55 12 33.85 11 32.85C7.3 29.15 5.2 24.05 5.2 18.65C5.2 13.25 7.3 8.25 11 4.45C12 3.45 12 1.75 11 0.75C10 -0.25 8.4 -0.25 7.4 0.75C2.7 5.55 0 11.85 0 18.65ZM14.8 29.05C15.8 30.05 17.5 30.05 18.5 29.05C19.5 28.05 19.5 26.35 18.5 25.35C16.8 23.65 15.7 21.15 15.7 18.65C15.7 16.05 16.6 13.75 18.5 11.95C19.5 10.95 19.5 9.25 18.5 8.25C17.5 7.25 15.8 7.25 14.8 8.25C12 11.05 10.5 14.75 10.5 18.65C10.5 22.55 12 26.25 14.8 29.05ZM48.2 0.75C47.2 -0.25 45.5 -0.25 44.5 0.75C43.5 1.75 43.5 3.45 44.5 4.45C48.2 8.15 50.4 13.25 50.4 18.65C50.4 24.05 48.3 29.05 44.5 32.75C43.5 33.75 43.5 35.45 44.5 36.45C45.5 37.45 47.2 37.45 48.2 36.45C53 31.65 55.6 25.35 55.6 18.55C55.6 11.75 53 5.55 48.2 0.75ZM45.2 18.65C45.1 14.75 43.6 10.95 40.8 8.25C39.8 7.25 38.2 7.25 37.2 8.25C36.2 9.25 36.2 10.95 37.2 11.95C38.9 13.85 40 16.15 40 18.65C40 21.25 39 23.65 37.2 25.35C36.2 26.35 36.2 28.05 37.2 29.05C38.2 30.05 39.8 30.05 40.8 29.05C43.6 26.25 45.1 22.55 45.1 18.65H45.2ZM25.2 24.85C22.6 23.85 21 21.35 21 18.45C21 14.75 24 11.75 27.7 11.75C31.4 11.75 34.6 14.75 34.6 18.45C34.6 21.35 32.9 23.65 30.4 24.75V28.05V52.25C30.4 52.95 29.7 53.65 29 53.55H26.4C25.7 53.55 25.1 52.95 25.1 52.25V27.95C25.2 27.95 25.2 24.85 25.2 24.85Z" fill="white"/>
</svg>
  )

  export const ActionIcon = () => (
<svg width="64" height="60" viewBox="0 0 64 60" className="h-6 w-6"  fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.96 46.0715C20.96 47.3715 18.35 48.0915 12.54 49.6115L3 52.1015C0.86 52.6615 -0.420001 54.8415 0.139999 56.9815C0.609999 58.7815 2.23 59.9715 4.01 59.9715C4.34 59.9715 4.68 59.9315 5.02 59.8415L14.56 57.3515C21.67 55.5015 25.58 54.4715 28.29 50.9615C31 47.4515 31 43.4015 31 36.0615V33.9715H53.28L45.28 41.9815C43.72 43.5415 43.72 46.0815 45.28 47.6415C46.06 48.4215 47.08 48.8115 48.11 48.8115C49.14 48.8115 50.16 48.4215 50.94 47.6415L60.73 37.8515C62.84 35.7615 64 32.9715 64.01 30.0015C64.01 30.0015 64.01 30.0015 64.01 29.9915C64.01 29.9915 64.01 29.9915 64.01 29.9815C64.01 27.0115 62.85 24.2315 60.75 22.1315L50.85 12.2315C49.29 10.6715 46.76 10.6715 45.19 12.2315C43.63 13.7915 43.63 16.3215 45.19 17.8915L53.3 26.0015H31V23.9115C31 16.5715 31 12.5215 28.29 9.01151C25.58 5.50151 21.66 4.48151 14.56 2.62151L5.02 0.131508C2.88 -0.428492 0.699999 0.851509 0.139999 2.99151C-0.420001 5.13151 0.86 7.31151 3 7.87151L12.54 10.3615C18.35 11.8815 20.96 12.6015 21.96 13.9015C22.96 15.2015 23 17.9015 23 23.9115V26.0015H4C1.79 26.0015 0 27.7915 0 30.0015C0 32.2115 1.79 34.0015 4 34.0015H23V36.0915C23 42.0915 22.96 44.8015 21.96 46.1015V46.0715Z" fill="white"/>
</svg>
  )

  export const ChainIcon = () => (
<svg width="63" height="56" viewBox="0 0 63 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M51.8364 6.55C50.699 4.55979 49.0557 2.90568 47.073 1.75537C45.0902 0.605071 42.8386 -0.000519779 40.5464 3.34743e-07H21.5464C19.2541 -0.000519779 17.0025 0.605071 15.0197 1.75537C13.037 2.90568 11.3937 4.55979 10.2564 6.55L1.76636 21.34C0.608825 23.367 0 25.6608 0 27.995C0 30.3292 0.608825 32.623 1.76636 34.65L10.2164 49.44C11.3524 51.4321 12.9952 53.0882 14.978 54.2403C16.9608 55.3924 19.2131 55.9995 21.5064 56H40.5064C42.7986 56.0005 45.0503 55.3949 47.033 54.2446C49.0157 53.0943 50.659 51.4402 51.7964 49.45L60.2464 34.66C61.4039 32.633 62.0127 30.3392 62.0127 28.005C62.0127 25.6708 61.4039 23.377 60.2464 21.35L51.8364 6.55ZM15.4364 9.55C16.045 8.47541 16.9272 7.58098 17.9932 6.95749C19.0593 6.33401 20.2714 6.00367 21.5064 6H41.5064L30.3164 25H6.58636L15.4364 9.55ZM21.5064 50C20.2716 50.0001 19.0588 49.6736 17.991 49.0537C16.9232 48.4337 16.0384 47.5423 15.4264 46.47L6.58636 31H30.3164L41.5464 50H21.5064ZM55.0264 31.68L46.4764 46.68L35.5164 28L46.5164 9.36L55.0664 24.36C55.7075 25.4805 56.0447 26.7491 56.0447 28.04C56.0447 29.331 55.7075 30.5995 55.0664 31.72L55.0264 31.68Z" fill="white"/>
</svg>
  )

  export const CreateUI = () => (
<svg width="79" height="79" viewBox="0 0 79 79" className="create-ui" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.46875 29.625H34.5625C35.9257 29.625 37.0312 28.5195 37.0312 27.1562V2.46875C37.0312 1.10551 35.9257 0 34.5625 0H2.46875C1.10551 0 0 1.10551 0 2.46875V27.1562C0 28.5195 1.10551 29.625 2.46875 29.625ZM5.9375 5.9375H31.0938V23.6875H5.9375V5.9375Z" fill="white"/>
<path d="M76.5312 1H44.4375C43.0743 1 41.9688 2.10551 41.9688 3.46875V42.9688C41.9688 44.332 43.0743 45.4375 44.4375 45.4375H76.5312C77.8945 45.4375 79 44.332 79 42.9688V3.46875C79 2.10551 77.8945 1 76.5312 1ZM73.0625 39.5H47.9062V6.9375H73.0625V39.5Z" fill="white"/>
<path d="M2.46875 79H34.5625C35.9257 79 37.0312 77.8945 37.0312 76.5312V37.0312C37.0312 35.668 35.9257 34.5625 34.5625 34.5625H2.46875C1.10551 34.5625 0 35.668 0 37.0312V76.5312C0 77.8945 1.10551 79 2.46875 79ZM5.9375 40.5H31.0938V73.0625H5.9375V40.5Z" fill="white"/>
<path d="M76.5312 49.375H44.4375C43.0743 49.375 41.9688 50.4805 41.9688 51.8438V76.5312C41.9688 77.8945 43.0743 79 44.4375 79H76.5312C77.8945 79 79 77.8945 79 76.5312V51.8438C79 50.4805 77.8945 49.375 76.5312 49.375ZM73.0625 73.0625H47.9062V55.3125H73.0625V73.0625Z" fill="white"/>
</svg>
  );





      export const CreateUIWhite = () => (
        <svg width="79" height="79" viewBox="0 0 79 79" className="create-ui" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.46875 29.625H34.5625C35.9257 29.625 37.0312 28.5195 37.0312 27.1562V2.46875C37.0312 1.10551 35.9257 0 34.5625 0H2.46875C1.10551 0 0 1.10551 0 2.46875V27.1562C0 28.5195 1.10551 29.625 2.46875 29.625ZM5.9375 5.9375H31.0938V23.6875H5.9375V5.9375Z" fill="black"/>
        <path d="M76.5312 1H44.4375C43.0743 1 41.9688 2.10551 41.9688 3.46875V42.9688C41.9688 44.332 43.0743 45.4375 44.4375 45.4375H76.5312C77.8945 45.4375 79 44.332 79 42.9688V3.46875C79 2.10551 77.8945 1 76.5312 1ZM73.0625 39.5H47.9062V6.9375H73.0625V39.5Z" fill="black"/>
        <path d="M2.46875 79H34.5625C35.9257 79 37.0312 77.8945 37.0312 76.5312V37.0312C37.0312 35.668 35.9257 34.5625 34.5625 34.5625H2.46875C1.10551 34.5625 0 35.668 0 37.0312V76.5312C0 77.8945 1.10551 79 2.46875 79ZM5.9375 40.5H31.0938V73.0625H5.9375V40.5Z" fill="black"/>
        <path d="M76.5312 49.375H44.4375C43.0743 49.375 41.9688 50.4805 41.9688 51.8438V76.5312C41.9688 77.8945 43.0743 79 44.4375 79H76.5312C77.8945 79 79 77.8945 79 76.5312V51.8438C79 50.4805 77.8945 49.375 76.5312 49.375ZM73.0625 73.0625H47.9062V55.3125H73.0625V73.0625Z" fill="black"/>
        </svg>
          );

  export const DraftIcon = () => (
    <svg width="84" height="84" viewBox="0 0 84 84" className="create-ui" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M83.25 13.9C83.25 10.2135 81.7882 6.67797 79.1861 4.07122C76.584 1.46446 73.0549 0 69.375 0H13.875C10.1951 0 6.66596 1.46446 4.06389 4.07122C1.46183 6.67797 0 10.2135 0 13.9V69.5C0 73.1865 1.46183 76.722 4.06389 79.3288C6.66596 81.9355 10.1951 83.4 13.875 83.4H48.4237C48.8825 83.4001 49.3367 83.3079 49.7592 83.129C50.1781 82.9546 50.5587 82.6995 50.8796 82.3784L82.2302 50.9713C82.88 50.3175 83.2464 49.4336 83.25 48.511V13.9ZM6.9375 69.5V13.9C6.9375 12.0567 7.66841 10.289 8.96945 8.98561C10.2705 7.68223 12.0351 6.95 13.875 6.95H69.375C71.2149 6.95 72.9795 7.68223 74.2806 8.98561C75.5816 10.289 76.3125 12.0567 76.3125 13.9V45.036H58.83C55.1501 45.036 51.621 46.5005 49.0189 49.1072C46.4168 51.714 44.955 55.2495 44.955 58.936V76.45H13.875C12.0351 76.45 10.2705 75.7178 8.96945 74.4144C7.66841 73.111 6.9375 71.3433 6.9375 69.5ZM71.4077 51.986L51.8925 71.5364V58.936C51.8925 57.0927 52.6234 55.325 53.9244 54.0216C55.2255 52.7182 56.9901 51.986 58.83 51.986H71.4077Z" fill="white"/>
    </svg>
  )

  export const ToolsIcon = () => (
<svg width="96" height="96" viewBox="0 0 96 96" className="create-ui" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M91.9901 66.36L73.6501 48L90.6501 31C94.0568 27.5972 95.9723 22.9806 95.9751 18.1656C95.9779 13.3506 94.0679 8.73168 90.6651 5.32497C87.2624 1.91826 82.6457 0.00281618 77.8307 3.10288e-06C73.0157 -0.00280998 68.3968 1.90724 64.9901 5.30997L47.9901 22.31L29.6301 3.99997C27.0725 1.44499 23.6053 0.00984002 19.9901 0.00984002C16.375 0.00984002 12.9077 1.44499 10.3501 3.99997L3.99013 10.36C1.43515 12.9176 0 16.3848 0 20C0 23.6151 1.43515 27.0824 3.99013 29.64L22.3301 48L14.5301 55.8C11.178 59.1346 8.52045 63.1009 6.71127 67.4694C4.90209 71.8378 3.9772 76.5217 3.99013 81.25V88C3.99013 89.0608 4.41156 90.0783 5.1617 90.8284C5.91185 91.5785 6.92926 92 7.99013 92H14.7401C19.4684 92.0129 24.1523 91.088 28.5207 89.2788C32.8892 87.4697 36.8555 84.8121 40.1901 81.46L47.9901 73.66L66.3501 92C68.9103 94.5501 72.3766 95.9818 75.9901 95.9818C79.6036 95.9818 83.0699 94.5501 85.6301 92L91.9901 85.64C94.5451 83.0824 95.9803 79.6151 95.9803 76C95.9803 72.3848 94.5451 68.9176 91.9901 66.36ZM70.6801 11C72.0964 9.58368 73.9004 8.61856 75.8646 8.22635C77.8288 7.83415 79.8651 8.03242 81.7167 8.79617C83.5683 9.55992 85.1522 10.8549 86.2687 12.5178C87.3852 14.1807 87.9842 16.137 87.9901 18.14C87.9939 19.4748 87.7305 20.7969 87.2152 22.0284C86.7 23.2598 85.9434 24.3756 84.9901 25.31L67.9901 42.31L53.6501 28L70.6801 11ZM34.5301 75.8C31.938 78.4081 28.8541 80.4759 25.457 81.8834C22.0599 83.291 18.4173 84.0104 14.7401 84H11.9901V81.25C11.9797 77.5728 12.6991 73.9302 14.1066 70.5331C15.5142 67.136 17.582 64.0521 20.1901 61.46L27.9901 53.66L42.3301 68L34.5301 75.8ZM86.3501 80L79.9901 86.36C79.4667 86.8885 78.8436 87.308 78.1571 87.5943C77.4705 87.8806 76.734 88.028 75.9901 88.028C75.2463 88.028 74.5098 87.8806 73.8232 87.5943C73.1366 87.308 72.5136 86.8885 71.9901 86.36L40.8101 55.18L9.63013 24C9.10283 23.4758 8.68436 22.8526 8.39881 22.1661C8.11326 21.4796 7.96626 20.7435 7.96626 20C7.96626 19.2565 8.11326 18.5203 8.39881 17.8338C8.68436 17.1474 9.10283 16.5241 9.63013 16L15.9901 9.63997C16.515 9.11387 17.1384 8.69646 17.8248 8.41166C18.5112 8.12687 19.247 7.98027 19.9901 7.98027C20.7333 7.98027 21.4691 8.12687 22.1555 8.41166C22.8418 8.69646 23.4653 9.11387 23.9901 9.63997L28.3301 14L21.1601 21.17C20.4096 21.9205 19.9879 22.9385 19.9879 24C19.9879 25.0614 20.4096 26.0794 21.1601 26.83C21.9107 27.5805 22.9287 28.0022 23.9901 28.0022C25.0516 28.0022 26.0696 27.5805 26.8201 26.83L33.9901 19.66L40.3301 26L37.1601 29.17C36.4096 29.9205 35.9879 30.9385 35.9879 32C35.9879 33.0614 36.4096 34.0794 37.1601 34.83C37.9107 35.5805 38.9287 36.0022 39.9901 36.0022C41.0516 36.0022 42.0696 35.5805 42.8201 34.83L45.9901 31.66L52.3301 38L45.1601 45.17C44.4096 45.9205 43.9879 46.9385 43.9879 48C43.9879 49.0614 44.4096 50.0794 45.1601 50.83C45.9107 51.5805 46.9287 52.0022 47.9901 52.0022C49.0516 52.0022 50.0696 51.5805 50.8201 50.83L57.9901 43.66L64.3301 50L61.1601 53.17C60.4096 53.9205 59.9879 54.9385 59.9879 56C59.9879 57.0614 60.4096 58.0794 61.1601 58.83C61.9107 59.5805 62.9287 60.0022 63.9901 60.0022C65.0516 60.0022 66.0696 59.5805 66.8201 58.83L69.9901 55.66L76.3301 62L69.1601 69.17C68.4096 69.9205 67.9879 70.9385 67.9879 72C67.9879 73.0614 68.4096 74.0794 69.1601 74.83C69.9107 75.5805 70.9287 76.0022 71.9901 76.0022C73.0516 76.0022 74.0696 75.5805 74.8201 74.83L81.9901 67.66L86.3501 72C86.8774 72.5241 87.2959 73.1474 87.5814 73.8338C87.867 74.5203 88.014 75.2565 88.014 76C88.014 76.7435 87.867 77.4796 87.5814 78.1661C87.2959 78.8526 86.8774 79.4758 86.3501 80Z" fill="white"/>
</svg>


  )

  export const WebhookIcon = () => (
    <svg width="81" height="76" viewBox="0 0 81 76" className="create-ui" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M66.4579 40.3755C64.9819 39.5205 64.4769 37.6285 65.3319 36.1515C66.1869 34.6755 68.0799 34.1705 69.5559 35.0255C76.0209 38.7685 80.3718 45.7625 80.3718 53.7635C80.3718 65.7055 70.6758 75.4015 58.7328 75.4015C47.8398 75.4015 38.8159 67.3345 37.3149 56.8545H21.6389C19.9329 56.8545 18.5479 55.4695 18.5479 53.7635C18.5479 52.0575 19.9329 50.6725 21.6389 50.6725H40.1459C40.9719 50.6615 41.7689 50.9825 42.3579 51.5635C42.9459 52.1445 43.2769 52.9365 43.2769 53.7635C43.2769 62.2935 50.2028 69.2195 58.7328 69.2195C67.2638 69.2195 74.1898 62.2935 74.1898 53.7635C74.1898 48.0465 71.0779 43.0505 66.4579 40.3755Z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M24.7299 21.6423C24.7279 23.3483 23.3409 24.7323 21.6349 24.7303C19.9289 24.7273 18.5449 23.3413 18.5479 21.6343C18.5569 14.1643 22.4379 6.89934 29.3669 2.89934C39.7099 -3.07166 52.9539 0.476344 58.9259 10.8193C64.3719 20.2533 61.8979 32.1023 53.5729 38.6423L61.4109 52.2183C62.2639 53.6953 61.7569 55.5873 60.2789 56.4403C58.8019 57.2933 56.9099 56.7863 56.0569 55.3093L46.8029 39.2813C46.3809 38.5713 46.2599 37.7203 46.4689 36.9203C46.6779 36.1203 47.1979 35.4373 47.9139 35.0243C55.3019 30.7583 57.8369 21.2983 53.5719 13.9103C49.3059 6.52334 39.8459 3.98834 32.4579 8.25334C27.5069 11.1123 24.7369 16.3043 24.7299 21.6423Z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M29.3701 67.147C30.8491 66.296 32.7401 66.805 33.5921 68.284C34.4431 69.762 33.9341 71.654 32.4551 72.505C25.9811 76.232 17.7491 76.503 10.8201 72.503C0.477091 66.531 -3.07191 53.287 2.89909 42.944C8.34609 33.51 19.8441 29.728 29.6711 33.668L37.5091 20.093C38.3621 18.615 40.2541 18.108 41.7321 18.961C43.2091 19.814 43.7161 21.706 42.8631 23.184L33.6101 39.211C33.2061 39.933 32.5291 40.462 31.7321 40.681C30.9351 40.901 30.0831 40.791 29.3671 40.378C21.9791 36.113 12.5191 38.648 8.25409 46.035C3.98809 53.423 6.52309 62.883 13.9111 67.149C18.8621 70.007 24.7441 69.81 29.3701 67.147Z" fill="white"/>
    <path d="M58.7335 63.8108C64.2823 63.8108 68.7805 59.3126 68.7805 53.7638C68.7805 48.215 64.2823 43.7168 58.7335 43.7168C53.1847 43.7168 48.6865 48.215 48.6865 53.7638C48.6865 59.3126 53.1847 63.8108 58.7335 63.8108Z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M31.4861 26.6623C28.7131 21.8603 30.3611 15.7103 35.1631 12.9383C39.9651 10.1653 46.1151 11.8133 48.8871 16.6153C51.6591 21.4173 50.0121 27.5673 45.2101 30.3393C40.4081 33.1123 34.2581 31.4643 31.4861 26.6623Z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M30.3398 58.7876C27.5668 63.5896 21.4178 65.2366 16.6158 62.4646C11.8128 59.6916 10.1658 53.5426 12.9378 48.7406C15.7108 43.9386 21.8598 42.2906 26.6618 45.0626C31.4638 47.8356 33.1118 53.9846 30.3398 58.7876Z" fill="white"/>
    </svg>
    
      )

  export const RouterIcon = () => (
<svg width="66" height="79" viewBox="0 0 66 79" className="create-ui" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.2569 4.34375C16.4624 6.13774 15.2827 8.45439 14.8875 10.9608C14.4922 13.4673 14.9016 16.0346 16.0569 18.2937L16.3869 18.9437L3.38686 31.9437C2.36487 32.9653 1.55415 34.1781 1.00103 35.513C0.447903 36.848 0.163208 38.2788 0.163208 39.7237C0.163208 41.1687 0.447903 42.5995 1.00103 43.9345C1.55415 45.2694 2.36487 46.4822 3.38686 47.5037L16.3869 60.5037L16.0569 61.1537C14.7552 63.699 14.4049 66.6253 15.0692 69.4059C15.7334 72.1864 17.3685 74.6385 19.6801 76.3206C21.9916 78.0026 24.8277 78.8042 27.6778 78.581C30.5278 78.3578 33.2046 77.1244 35.226 75.1029C37.2475 73.0815 38.4809 70.4047 38.7041 67.5547C38.9274 64.7046 38.1258 61.8685 36.4437 59.557C34.7616 57.2454 32.3095 55.6103 29.529 54.9461C26.7484 54.2818 23.8221 54.6321 21.2769 55.9337L20.6269 56.2637L7.11686 42.7037H41.9869L42.2069 43.3937C42.8393 45.3467 43.9621 47.1048 45.468 48.4999C46.974 49.895 48.8126 50.8804 50.8081 51.362C52.8036 51.8435 54.8893 51.8052 56.8658 51.2505C58.8422 50.6958 60.6433 49.6433 62.0969 48.1937C64.3512 45.9394 65.6177 42.8819 65.6177 39.6937C65.6177 36.5056 64.3512 33.4481 62.0969 31.1937C59.8425 28.9394 56.785 27.6729 53.5969 27.6729C50.4087 27.6729 47.3512 28.9394 45.0969 31.1937C43.7536 32.5332 42.7521 34.1761 42.1769 35.9837L41.9869 36.7037H7.11686L20.6369 23.1838L21.2869 23.5137C23.2568 24.5243 25.4679 24.9703 27.6755 24.8022C29.8831 24.6341 32.0012 23.8585 33.7954 22.5613C35.5895 21.264 36.9898 19.4957 37.8414 17.452C38.6929 15.4083 38.9624 13.1688 38.6201 10.9815C38.2777 8.79407 37.3369 6.74402 35.9018 5.05816C34.4666 3.37229 32.593 2.11633 30.4883 1.42926C28.3836 0.742182 26.1299 0.65078 23.9764 1.16516C21.823 1.67953 19.8538 2.77964 18.2869 4.34375H18.2569ZM30.9869 62.3437C31.9703 63.3238 32.5834 64.6145 32.7217 65.996C32.8601 67.3775 32.515 68.7641 31.7454 69.9197C30.9758 71.0752 29.8293 71.9281 28.5012 72.333C27.1732 72.7378 25.7458 72.6696 24.4625 72.1399C23.1791 71.6102 22.1192 70.6519 21.4633 69.4282C20.8074 68.2045 20.5962 66.7912 20.8657 65.4292C21.1351 64.0673 21.8686 62.8409 22.941 61.9591C24.0135 61.0774 25.3585 60.5948 26.7469 60.5937C28.3348 60.5898 29.8595 61.2155 30.9869 62.3337V62.3437ZM49.3669 35.4637C50.3469 34.4803 51.6376 33.8672 53.0191 33.7289C54.4006 33.5905 55.7872 33.9356 56.9428 34.7052C58.0983 35.4748 58.9512 36.6214 59.3561 37.9494C59.7609 39.2774 59.6927 40.7048 59.163 41.9881C58.6333 43.2715 57.675 44.3314 56.4513 44.9873C55.2276 45.6432 53.8143 45.8544 52.4523 45.5849C51.0904 45.3155 49.864 44.582 48.9822 43.5096C48.1005 42.4372 47.618 41.0921 47.6169 39.7037C47.6156 38.1144 48.245 36.5895 49.3669 35.4637ZM30.9869 8.59375C31.9679 9.57596 32.5779 10.868 32.7131 12.2496C32.8482 13.6312 32.5001 15.0169 31.7281 16.1706C30.9561 17.3243 29.8079 18.1746 28.4792 18.5766C27.1504 18.9787 25.7234 18.9075 24.4413 18.3753C23.1592 17.8431 22.1013 16.8828 21.4478 15.658C20.7944 14.4332 20.5859 13.0197 20.8578 11.6584C21.1298 10.2971 21.8653 9.07221 22.9392 8.19246C24.013 7.3127 25.3587 6.83252 26.7469 6.83374C28.3376 6.83514 29.8627 7.46821 30.9869 8.59375Z" fill="white"/>
</svg>

  )

  export const DelayIcon = () => (
  <svg width="62" height="62" viewBox="0 0 62 62" className="create-ui"  fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.615 16.9915C26.6042 17.1174 25.6759 17.6132 25.0092 18.3833C24.3426 19.1534 23.9848 20.1431 24.005 21.1615V29.9915C24.005 32.1132 24.8478 34.148 26.3481 35.6483C27.8484 37.1486 29.8832 37.9915 32.005 37.9915H38.835C39.8533 38.0116 40.8431 37.6539 41.6132 36.9872C42.3832 36.3205 42.8791 35.3922 43.005 34.3815C43.0595 33.8244 42.9966 33.262 42.8202 32.7307C42.6437 32.1995 42.3578 31.7112 41.9807 31.2974C41.6037 30.8836 41.144 30.5536 40.6314 30.3286C40.1188 30.1037 39.5647 29.9888 39.005 29.9915H32.005V20.9915C32.0076 20.4317 31.8928 19.8776 31.6678 19.365C31.4429 18.8524 31.1128 18.3927 30.699 18.0157C30.2853 17.6387 29.797 17.3527 29.2657 17.1763C28.7344 16.9998 28.1721 16.9369 27.615 16.9915Z" fill="white"/>
<path d="M39.005 1.05137C32.4614 -0.697659 25.525 -0.255419 19.2565 2.31047C12.988 4.87635 7.73242 9.42466 4.29331 15.2599C0.854196 21.0952 -0.579133 27.8962 0.212492 34.6231C1.00412 41.35 3.97713 47.6325 8.67692 52.51C13.3767 57.3874 19.5446 60.5914 26.2375 61.632C32.9304 62.6726 39.78 61.4925 45.7388 58.2722C51.6976 55.0518 56.4377 49.9685 59.2343 43.7995C62.0309 37.6305 62.7301 30.7153 61.225 24.1114C61.1179 23.59 60.9079 23.0953 60.6072 22.6562C60.3065 22.217 59.9212 21.8423 59.4738 21.554C59.0265 21.2657 58.5261 21.0695 58.002 20.977C57.4779 20.8845 56.9406 20.8975 56.4216 21.0153C55.9026 21.1331 55.4123 21.3532 54.9794 21.6629C54.5465 21.9725 54.1798 22.3655 53.9008 22.8187C53.6217 23.2718 53.4359 23.7761 53.3542 24.3021C53.2725 24.828 53.2965 25.3649 53.425 25.8814C54.5402 30.7841 54.0182 35.9172 51.9389 40.495C49.8595 45.0729 46.3373 48.8432 41.9114 51.229C37.4855 53.6147 32.3997 54.4845 27.4325 53.705C22.4654 52.9256 17.8904 50.54 14.408 46.9133C10.9255 43.2866 8.72737 38.6187 8.15004 33.624C7.57272 28.6293 8.64799 23.583 11.2113 19.2575C13.7746 14.932 17.6847 11.5656 22.3431 9.6736C27.0015 7.78158 32.1515 7.46819 37.005 8.78137C38.0043 8.9746 39.0397 8.7796 39.9003 8.23609C40.7609 7.69258 41.3819 6.84144 41.6368 5.85605C41.8918 4.87066 41.7615 3.82513 41.2725 2.93245C40.7835 2.03976 39.9726 1.36706 39.005 1.05137Z" fill="white"/>
</svg>

  )


  export const ScheduleIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64"  className="create-ui"  fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 48H44C46.21 48 48 46.21 48 44C48 41.79 46.21 40 44 40H20C17.79 40 16 41.79 16 44C16 46.21 17.79 48 20 48Z" fill="white"/>
<path d="M1.74 55.26C3.28 58.29 5.7 60.71 8.73 62.25C12.15 63.99 14.68 63.99 20.79 63.99H44.19C48.29 63.99 51.83 63.99 55.25 62.25C58.28 60.71 60.7 58.29 62.24 55.26C63.98 51.84 63.98 48.4 63.98 43.2V30.8C63.98 25.6 63.98 22.16 62.24 18.74C60.7 15.71 58.28 13.29 55.25 11.75C54.5 11.37 53.75 11.08 52.99 10.85V4C52.99 1.79 51.2 0 48.99 0C46.78 0 44.99 1.79 44.99 4V10C44.41 10 43.82 10 43.19 10H35.99V4C35.99 1.79 34.2 0 31.99 0C29.78 0 27.99 1.79 27.99 4V10H20.79C20.16 10 19.57 10 18.99 10V4C18.99 1.79 17.2 0 14.99 0C12.78 0 10.99 1.79 10.99 4V10.85C10.22 11.08 9.47 11.37 8.73 11.75C5.7 13.29 3.28 15.71 1.74 18.74C-2.38419e-07 22.16 0 25.6 0 30.8V43.2C0 48.4 -2.38419e-07 51.84 1.74 55.26ZM8 30.8C8 26.02 8.03 24.01 8.87 22.37C9.64 20.85 10.85 19.65 12.37 18.87C14.02 18.03 16.02 18 20.8 18H43.2C47.98 18 49.99 18.03 51.63 18.87C53.14 19.64 54.35 20.85 55.13 22.37C55.97 24.02 56 26.02 56 30.8V43.2C56 47.98 55.97 49.99 55.13 51.63C54.36 53.15 53.15 54.35 51.63 55.13C49.92 56 47.64 56 44.2 56H20.8C14.92 56 13.97 55.95 12.37 55.13C10.86 54.36 9.65 53.15 8.87 51.63C8.03 49.98 8 47.98 8 43.2V30.8Z" fill="white"/>
</svg>
  )

  export const APIIcon = () => (
    <svg width="60" height="63"  className="create-ui"  viewBox="0 0 60 63" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 4H3C2.20435 4 1.44129 4.31607 0.878679 4.87868C0.31607 5.44129 0 6.20435 0 7C0 7.79565 0.31607 8.55871 0.878679 9.12132C1.44129 9.68393 2.20435 10 3 10H5C7.65216 10 10.1957 11.0536 12.0711 12.9289C13.9464 14.8043 15 17.3478 15 20V45C14.9443 49.5087 16.682 53.8548 19.8307 57.0823C22.9794 60.3098 27.2813 62.1543 31.79 62.21C36.2987 62.2657 40.6448 60.528 43.8723 57.3793C47.0998 54.2306 48.9443 49.9287 49 45.42V44.68L49.72 44.48C52.6718 43.6664 55.2755 41.9075 57.1323 39.4729C58.989 37.0382 59.9963 34.0619 60 31V22C60 20.4087 59.3679 18.8826 58.2426 17.7574C57.1174 16.6321 55.5913 16 54 16H49V3C49 2.20435 48.6839 1.44129 48.1213 0.878679C47.5587 0.31607 46.7956 0 46 0C45.2044 0 44.4413 0.31607 43.8787 0.878679C43.3161 1.44129 43 2.20435 43 3V16H38C36.4087 16 34.8826 16.6321 33.7574 17.7574C32.6321 18.8826 32 20.4087 32 22V31C32.004 34.0563 33.0081 37.0273 34.8588 39.4594C36.7096 41.8916 39.3054 43.6514 42.25 44.47L43.01 44.68V45.47C42.9477 48.3887 41.7284 51.1631 39.6205 53.1829C37.5126 55.2026 34.6887 56.3023 31.77 56.24C28.8513 56.1777 26.0769 54.9584 24.0571 52.8505C22.0374 50.7426 20.9377 47.9187 21 45V20C21 15.7565 19.3143 11.6869 16.3137 8.68629C13.3131 5.68571 9.24346 4 5 4ZM38 30.72V23C38 22.7348 38.1054 22.4804 38.2929 22.2929C38.4804 22.1054 38.7348 22 39 22H53C53.2652 22 53.5196 22.1054 53.7071 22.2929C53.8946 22.4804 54 22.7348 54 23V31C54.0026 32.0985 53.7789 33.1858 53.3429 34.194C52.907 35.2023 52.268 36.11 51.4659 36.8605C50.6637 37.6111 49.7156 38.1884 48.6806 38.5565C47.6456 38.9245 46.5459 39.0755 45.45 39C43.3929 38.8136 41.4823 37.8569 40.1008 36.3214C38.7192 34.786 37.9689 32.7852 38 30.72Z" fill="white"/>
    </svg>
    )

