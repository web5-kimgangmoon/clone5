// gpt에게 이미지 링크 딸때 만들어 달라고 한 코드.
// (() => {
//   const urls = new Set();
//   // <img>
//   document.querySelectorAll('img').forEach(img => {
//     if (img.src) urls.add(img.src);

//     if (img.srcset) {
//       img.srcset.split(',').forEach(item => {
//         const url = item.trim().split(/\s+/)[0];
//         if (url) urls.add(url);
//       });
//     }
//   });

//   // CSS background-image
//   document.querySelectorAll('*').forEach(el => {
//     const bg = getComputedStyle(el).backgroundImage;
//     const matches = bg.match(/url\(["']?(.*?)["']?\)/g);

//     if (matches) {
//       matches.forEach(match => {
//         const url = match.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
//         if (url) urls.add(url);
//       });
//     }
//   });

//   console.log([...urls].join('\n'));
// })();
// 이쪽은 코드리뷰.
// (() => {
//   const urls = new Set(); // 중복없는 객체 Set 생성. 굳이 Set으로 생성한 이유는 만약 중복된 이미지가 추가될 경우 자동적으로 합쳐지도록 만들기 위함으로 추정됨.
//   // <img> // gpt가 달아준 주석. 이미지 태그쪽 이미지를 가져오겠다는 표시.
//   document.querySelectorAll('img').forEach(img => { // 모든 img 태그들을 배열로 가져오고 각각을 체크한다.
//     if (img.src) urls.add(img.src); // img 태그의 src 속성을 확인. 있을 경우 문자 혹은 문자열이므로 null이 아닐 경우 참. src의 문자열들을 전부 추가.

//     if (img.srcset) { //  img 태그의 srcset 속성 체크. 반응형 이미지이며, 구분자는 쉼표다.
//       img.srcset.split(',').forEach(item => {
//         const url = item.trim().split(/\s+/)[0];
//         if (url) urls.add(url);
//       });
//     }
//   });

//   // CSS background-image 백그라운드 이미지를 여기서 가져오겠다는 의미
//   document.querySelectorAll('*').forEach(el => { // img 태그가 아니라, 어떤 요소에 배경으로 넣어뒀는지 모르므로 el로 둔 듯하다.
//     const bg = getComputedStyle(el).backgroundImage; // getComputedStyle는 최종적으로 적용된 스타일값을 의미한다. 각 요소에 style로 인라인으로 들어가 있지 않고, css나 js로 추가될 경우 받아오질 못하기에 getComputedStyle를 사용했다.
//     const matches = bg.match(/url\(["']?(.*?)["']?\)/g); // 정규 표현식. 전형적인 background-image 속성 구조. url("") 혹은 url('') .*?은 모든 문자를 포함하며, 몇 회 반복인지 모른다는 표시다. /g는 여러 이미지가 포함될 수 있으니, global로 설정했다.

//     if (matches) { // null(아무것도 못 찾음)일 경우 false, array(이미지를 찾음)일 경우, true
//       matches.forEach(match => {
//         const url = match.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''); // url(" 혹은 url('을 빈값으로 바꾸고 ') 혹은 ")을 빈값으로 바꿔 https://이미지 네임.확장자명만 남기도록 한다.
//         if (url) urls.add(url); // 남은 모두를 url에 추가.
//       });
//     }
//   });

//   console.log([...urls].join('\n')); // 결과적으로 img 태그의 src와 srcset에서 긁어온 링크. background-image 속성에서 긁어온 링크들이 urls 객체에 들어있다. Set 객체이므로 중복된 값은 자연적으로 합쳐진다. Set을 구조분해할당 함으로써 배열로 타입변환 시켜줄 수 있다.
// })();

// Deepseek에게 짜달라한 다운로드 코드 (코드리뷰+)

const https = require("https"); // node.js의 내장 모듈
const http = require("http"); // node.js의 내장 모듈
const fs = require("fs"); // node.js의 내장 모듈
const path = require("path"); // node.js의 내장 모듈

// 👇 줄바꿈으로 구분된 URL 문자열 (여기에 붙여넣으세요) // Deepseek이 친절하게 링크를 입력할 곳을 주석으로 지정해줬다.
const urlText = `
https://image.istarbucks.co.kr/common/img/common/user_pic_sample.jpg
https://image.istarbucks.co.kr/common/img/common/icon_add_card.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/001.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/002.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/002.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/003.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/003.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/004.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/004.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/005.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/005.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/006.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/006.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/007.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/007.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/008.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/008.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/009.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/009.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/010.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/010.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/011.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/011.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/012.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/012.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/013.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/013.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/014.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/014.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/015.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/015.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/016.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/016.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/017.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/017.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/018.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/018.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/019.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/019.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/020.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/020.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/021.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/021.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/022.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/022.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/023.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/023.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/024.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/025.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/024.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/026.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/025.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/027.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/026.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/028.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/027.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/029.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/028.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/030.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/029.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/031.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/030.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/032.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/031.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/033.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/032.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/034.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/033.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/035.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/034.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/036.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/035.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/037.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/036.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/038.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/037.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/039.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/038.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/040.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/039.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/041.png
https://image.istarbucks.co.kr/common/img/common/rcup_m/logout/042.png
https://image.istarbucks.co.kr/common/img/common/icon_magnifier_black.png
https://image.istarbucks.co.kr/common/img/common/rcup/logout/001.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_top_slogan_260716.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_top_slogan_mo_260716.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_top_drink01_260716_v2.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_top_drink01_mo_260716.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_top_drink02_260716_v2.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_top_drink02_mo_260716.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_top_drink03_260716_v2.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_top_drink03_mo_260716.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_top_drink04_260716_v2.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_top_drink04_mo_260716.png
https://image.istarbucks.co.kr/common/img/common/notice_ttl.png
https://image.istarbucks.co.kr/common/img/common/btn_prom_down.png
https://image.istarbucks.co.kr/upload/banner/v7cliO_20260811151932719.jpg
https://image.istarbucks.co.kr/upload/banner/zyLEur_20260727081024913.jpg
https://image.istarbucks.co.kr/common/img/main/rewards-logo.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_promotion_beans_260716.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_promotion_beans_mo_260716.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_promotion_txt_260716.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_promotion_txt_mo_260716.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/260427_pc_reserve_title.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/260427_pc_reserve_coffee.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/260427_mo_reserve.png
https://image.istarbucks.co.kr/upload/common/img/etc/reserve_text_pc.png
https://image.istarbucks.co.kr/upload/common/img/etc/reserve_visual_pc.png
https://image.istarbucks.co.kr/upload/common/img/etc/reserve_visual_m.jpg
https://image.istarbucks.co.kr/img/event/2022/footer_award_2211_01.jpg
https://image.istarbucks.co.kr/img/event/2022/footer_award_2211_02.jpg
https://image.istarbucks.co.kr/img/event/2022/footer_award_2211_03.jpg
https://image.istarbucks.co.kr/img/event/2022/footer_award_2211_04.jpg
https://image.istarbucks.co.kr/img/event/2022/footer_award_2211_05.jpg
https://image.istarbucks.co.kr/img/event/2022/footer_award_2211_06.jpg
https://image.istarbucks.co.kr/img/event/2022/footer_award_2211_07.jpg
https://image.istarbucks.co.kr/img/event/2023/231201_popup_denger.png
https://image.istarbucks.co.kr/img/event/2026/img_popup_260521.jpg
https://www.starbucks.co.kr/common/img/common/msr_user_mask.png
https://www.starbucks.co.kr/common/img/common/msr_star_bg.png
https://www.starbucks.co.kr/common/img/common/icon_msr_cup.png
https://www.starbucks.co.kr/common/img/common/tablet_icon_calendar.png
https://www.starbucks.co.kr/common/img/common/tablet_icon_coupon.png
https://www.starbucks.co.kr/common/img/common/icon_before_login.png
https://www.starbucks.co.kr/common/img/common/icon_add_card.png
https://www.starbucks.co.kr/common/img/common/logo.png
https://www.starbucks.co.kr/common/img/common/icon_user_m.png
https://www.starbucks.co.kr/common/img/common/icon_spot_m.png
https://www.starbucks.co.kr/common/img/common/btn_berger_m.png
https://www.starbucks.co.kr/common/img/common/btn_gnb_close.png
https://www.starbucks.co.kr/common/img/common/mob_gnb_arrow_down_w.png
https://www.starbucks.co.kr/common/img/common/mob_gnb_arrow_down_g.png
https://www.starbucks.co.kr/common/img/common/sdown_util_sep.png
https://www.starbucks.co.kr/common/img/common/gnb_sub_txbg.jpg
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_top_bg_mo_260716_v2.jpg
https://www.starbucks.co.kr/common/img/common/notice_ttl.png
https://www.starbucks.co.kr/common/img/common/btn_notice_plus.png
https://www.starbucks.co.kr/common/img/common/prom_ttl_b.png
https://www.starbucks.co.kr/common/css/images/controls.png
https://www.starbucks.co.kr/common/img/main/main_prom_stop.png
https://www.starbucks.co.kr/common/img/main/main_prom_off.png
https://www.starbucks.co.kr/common/img/main/main_prom_on.png
https://www.starbucks.co.kr/common/img/common/arrow_left_on.png
https://www.starbucks.co.kr/common/img/common/arrow_right_on.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_promotion_bg_mo_260716.jpg
https://image.istarbucks.co.kr/upload/common/img/main/2026/260427_pc_reserve_bg.jpg
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_pick_bg_mo_260716.jpg
https://image.istarbucks.co.kr/upload/common/img/main/2024/2025_january_pick_txt01_mo.png
https://image.istarbucks.co.kr/upload/common/img/main/2024/2025_january_pick_txt02_mo.png
https://image.istarbucks.co.kr/upload/common/img/main/2026/2026_summer2_pick_img_260716.png
https://www.starbucks.co.kr/common/img/main/menu_bg.jpg
https://www.starbucks.co.kr/common/img/main/menu_txt01.png
https://www.starbucks.co.kr/common/img/main/menu_txt02.png
https://www.starbucks.co.kr/common/img/main/menu_img01.png
https://image.istarbucks.co.kr/upload/common/img/main/2021/reserve_bg_pc.png
https://www.starbucks.co.kr/common/img/main/store_bg.jpg
https://image.istarbucks.co.kr/img/event/2022/221212_main_story_2.png
https://image.istarbucks.co.kr/img/event/2022/221212_main_story_1.png
https://www.starbucks.co.kr/common/img/main/store_exp_img03.png
https://www.starbucks.co.kr/common/img/main/store_exp_img04.png
https://image.istarbucks.co.kr/img/event/2022/221213_m_main_story_txt_1.png
https://image.istarbucks.co.kr/img/event/2022/221212_m_main_story_txt_2.png
https://www.starbucks.co.kr/common/img/footer/footer_logo.png
https://www.starbucks.co.kr/common/img/util/cal/calpop_close2n.png
https://www.starbucks.co.kr/common/img/store/holiday_close_btn.png
https://image.istarbucks.co.kr/common/img/util/ck_icon.jpg
`;

// 줄바꿈 기준으로 배열로 변환 + 빈 줄 제거
const imageUrls = urlText
  .split("\n")
  .map((url) => url.trim())
  .filter((url) => url.length > 0); // split는 줄넘김 기준으로 배열 변환. trim은 예상치못한 빈칸을 없애기 위함으로 추정. filter는 중도에 들어간 trim으로 길이가 0이된 빈값 혹은 실수한 줄넘김을 처리할 목적으로 추정된다.

const downloadDir = "./downloads"; // 굳이 변수 생성할 이유가 없어 보인다. 아마 수정을 염두에 둔듯 싶다. "./downloads" 경로.

if (!fs.existsSync(downloadDir)) {
  // 해당 다운로드 경로가 없을시엔(여러번 코드 재사용을 가정한듯.)
  fs.mkdirSync(downloadDir, { recursive: true }); // 재귀옵션을 넣었다. 의도 불명. 아마 조금이라도 오류를 줄이고 싶었나보다.
}

function getFileName(url, index) {
  // 메소드 생성.
  const urlPath = new URL(url).pathname; // 입력받은 url의 pathname을 저장.
  const ext = path.extname(urlPath) || ".jpg"; // 확장자명을 저장. 확장자명이 없을시 빈 문자열 반환(false 취급), 논리연산자 (or)에 의해, .jpg를 반환.
  const base = path.basename(urlPath, ext) || `image-${index + 1}`; // 빈 문자열을 방어하자는 의도로 추정. 순수 사이트 주소만 가진 페이지는 오류가 나니까.
  return `${base}${ext}`; // 명칭+확장자
}

function downloadImage(url, filePath) {
  // 비동기 함수의 리턴 반환
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http; // https인지 체크 후, https 모듈 혹은 http 모듈

    client // node.js를 활용한 get 코드
      .get(url, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location // 300대 오류가 날 경우 + location (리다이렉션할 주소)을 응답에 같이 보내줬을 경우
        ) {
          downloadImage(response.headers.location, filePath)
            .then(resolve)
            .catch(reject); // 재귀함수 형식으로 리다이렉션. await를 쓰지 않으므로, 비동기 리다이렉션시 재귀함수 형식이 필요하다.
          return;
        }
        if (response.statusCode !== 200) {
          // 200대 코드(요청성공)이 아닐 경우.
          reject(new Error(`Status ${response.statusCode}`)); // reject 객체를 반환. reject 객체는 아래 코드에서 실패결과를 출력하는데 쓰임.
          return;
        }
        const fileStream = fs.createWriteStream(filePath); // 파일에 데이터를 쓸 통로 열기. 통로는 경로와 파일명이 함께 지정되어 있다. downloadAll 메소드 참조.
        response.pipe(fileStream); // 웹에서 다운로드 중인 파일을 실시간으로 저장하는 코드.
        fileStream.on("finish", () => {
          fileStream.close(); // 끝나면, 파일스트림 닫기
          console.log(`✅ ${filePath}`); // 성공했다고 콘솔에 띄움.
          resolve(); // resolve. 작업 완료
        });
        fileStream.on("error", (err) => {
          fs.unlink(filePath, () => {}); // 에러뜰 경우 불완전 파일. 그러므로 경로상 파일을 삭제.
          reject(err); // error 객체가 매개변수로 쓰이는 reject 호출.
        });
      })
      .on("error", reject); // 요청 중 에러시, reject 호출
  });
}

async function downloadAll() {
  console.log(`📥 Downloading ${imageUrls.length} images...\n`); // 몇 개 이미지가 다운로드 예정인지 콘솔창에 표시.

  const results = await Promise.allSettled(
    // allSettled. 모든 비동기 함수를 리턴하면 결과값을 반환.
    imageUrls.map((url, i) => {
      // url들은 배열형태. map으로 모두 요청한다.
      const fileName = getFileName(url, i); // 파일이름을 url에서 받아온다.
      const filePath = path.join(downloadDir, fileName); // 경로와 파일명을 합친다.
      return downloadImage(url, filePath); // url과 파일명을 함께 보낸다.
    }),
  );

  const success = results.filter((r) => r.status === "fulfilled").length; // 이행완료된 프로미스 결과 객체들 배열 갯수
  const failed = results.filter((r) => r.status === "rejected").length; // 실패한(reject 호출됨) 프로미스 결과 객체들 배열 갯수
  console.log(`\n🎉 Done! ${success} succeeded, ${failed} failed.`);
}

downloadAll(); // 메소드를 실행함으로써 다운로드 작업실시.
