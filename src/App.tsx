/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  AlertTriangle, 
  ShieldCheck, 
  LogOut, 
  Crown, 
  Flower2, 
  Ghost,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Info,
  UserCheck,
  User,
  ShieldAlert,
  Instagram,
  Maximize2,
  X
} from 'lucide-react';

declare global {
  interface Window { 
    google: any; 
    __googleInitDone?: boolean;
  }
}

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GAS_URL || "YOUR_GAS_WEB_APP_URL";
// YOUR_GOOGLE_CLIENT_ID (e.g. 1003959654198-xxx.apps.googleusercontent.com)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1003959654198-dlmeohcihgsekr53ufmuel72qg7ungj0.apps.googleusercontent.com";

type Category = '校草' | '校花' | '校猴';

interface Nominee {
  id: string;
  category: Category;
  classNum: string;
  name: string;
  ig?: string;
  reason?: string;
  photo?: string;
}

interface UserProfile {
  email: string;
  name: string;
  picture: string;
  credential: string;
}

// 測試名單
const NOMINEES: Nominee[] = [
  // 校草
  { id: '101-許智勛-校草', category: '校草', classNum: '101', name: '許智勛', ig: '未提供' },
  { id: '102-高以昂-校草', category: '校草', classNum: '102', name: '高以昂', ig: '@tal1ian', reason: 'handsome bro, 帥, 身材好懂穿搭長很帥成績還很好, 個性很好, 帥潮 健身 倒三角, 又會讀書又帥又會打球', photo: 'https://i.ibb.co/6014jTj2/102.jpg' },
  { id: '102-楊謹謹-校草', category: '校草', classNum: '102', name: '楊謹謹', ig: '未提供', reason: '全校最帥不容質疑' },
  { id: '103-馬銘寬-校草', category: '校草', classNum: '103', name: '馬銘寬', ig: '@takagisannnnnn', reason: '又高又帥又憨又組排前10又會打排球' },
  { id: '106-謝崴宇-校草', category: '校草', classNum: '106', name: '謝崴宇', ig: '@hsiang_114514', reason: '我是他爸，我支持兒子👦' },
  { id: '109-陳浚瑞-校草', category: '校草', classNum: '109', name: '陳浚瑞', ig: '@chen_jack0830', reason: '偉大，無需多言', photo: 'https://i.ibb.co/G46WKtff/109.jpg' },
  { id: '110-吳紹綸-校草', category: '校草', classNum: '110', name: '吳紹綸', ig: '@allen._wtf', reason: '陽光帥氣有活力很有特色第一眼會令人印象深刻是校草的不二人選' },
  { id: '112-李柏陞-校草', category: '校草', classNum: '112', name: '李柏陞', ig: '@libosheng0608', reason: '帥潮', photo: 'https://i.ibb.co/Ld783xFK/112.jpg' },
  { id: '112-陳子惟-校草', category: '校草', classNum: '112', name: '陳子惟', ig: '未提供', reason: '一中嘉豪、櫻桃小嘴' },
  { id: '203-洪至呈-校草', category: '校草', classNum: '203', name: '洪至呈', ig: '@channing_3978', reason: '臺灣護國神山top3 1.洪至呈 2.台積電 3.珍珠奶茶, 六邊形資優生，文武雙全', photo: 'https://i.ibb.co/bj4wHwCc/203.jpg' },
  { id: '205-陳寬澂-校草', category: '校草', classNum: '205', name: '陳寬澂', ig: '@ckuanc.416', reason: '負責任的男人最帥了' },
  { id: '209-張弋安-校草', category: '校草', classNum: '209', name: '張弋安', ig: '未提供' },
  { id: '210-詹純君-校草', category: '校草', classNum: '210', name: '詹純君', ig: '@cjyun._.06.08', reason: '他是詹純君', photo: 'https://i.ibb.co/LDrTXBcC/210.jpg' },
  { id: '216-李安石-校草', category: '校草', classNum: '216', name: '李安石', ig: '高冷男神拒絕社群', reason: '本人又帥又幽默，籃球排球還超強根本暈爛' },
  { id: '217-賴柚樺-校草', category: '校草', classNum: '217', name: '賴柚樺', ig: '@luke._.0315', reason: '又帥又會拉二胡，誰不暈呢？' },

  // 校花
  { id: '102-游本琦-校花', category: '校花', classNum: '102', name: '游本琦', ig: '未提供', reason: '漂亮' },
  { id: '102-楊謹謹-校花', category: '校花', classNum: '102', name: '楊謹謹', ig: '未提供', reason: '兩千年前是一朵花' },
  { id: '103-馬銘寬-校花', category: '校花', classNum: '103', name: '馬銘寬', ig: '@takagisannnnnn', reason: '長得很漂亮 小男娘一個🥵', photo: 'https://i.ibb.co/wZTnQjCM/103.jpg' },
  { id: '108-賴彥羽-校花', category: '校花', classNum: '108', name: '賴彥羽', ig: '@charlielai0613', reason: '從小留長髮，自稱“妹ㄇㄟ妹ㄇㄟ” ,要顏質有顏質，要成績有成績，要技術有技術（是台中一中荒野亂鬥比賽冠軍）還是學生會祕書', photo: 'https://i.ibb.co/mV6NsrFK/108.jpg' },
  { id: '112-王秋掬-校花', category: '校花', classNum: '112', name: '王秋掬', ig: '未提供' },
  { id: '112-李柏陞-校花', category: '校花', classNum: '112', name: '李柏陞', ig: '@libosheng0608', reason: '男娘好香', photo: 'https://i.ibb.co/Ld783xFK/112.jpg' },
  { id: '112-陳睿勳-校花', category: '校花', classNum: '112', name: '陳睿勳', ig: '@muk49aa_', reason: '溫文儒雅, 可愛男娘', photo: 'https://i.ibb.co/hRrWrzws/112.jpg' },
  { id: '114-張惟綱-校花', category: '校花', classNum: '114', name: '張惟綱', ig: '@vicxia._.0530', reason: '身為台中一中熱音社的惟綱，曾在多次選美比賽獲獎，今天來選校花他也是覺得輕輕鬆鬆，本人真的太漂亮了😻', photo: 'https://i.ibb.co/wZqQF51p/114.jpg' },
  { id: '114-蕭方禹-校花', category: '校花', classNum: '114', name: '蕭方禹', ig: '未提供', reason: '實力與美貌兼具的公主', photo: 'https://i.ibb.co/8n2k6xGT/114.jpg' },
  { id: '122-王妍恩-校花', category: '校花', classNum: '122', name: '王妍恩', ig: '@yanen9943', reason: '雖然我根本不認識她，但我覺得她很正很可愛，僅此而已∠( ᐛ 」∠)＿', photo: 'https://i.ibb.co/ynTP2Qwr/122.jpg' },
  { id: '125-李霈其-校花', category: '校花', classNum: '125', name: '李霈其', ig: '@happ.y0706', reason: '不只外表好看，個性很開朗大方很好相處，會運動會畫畫' },
  { id: '205-陳寬澂-校花', category: '校花', classNum: '205', name: '陳寬澂', ig: '@ckuanc.416' },
  { id: '213-張建畇-校花', category: '校花', classNum: '213', name: '張建畇', ig: '@choir._.59_finale', reason: '合唱團團寵 甜死人的可愛笑容令人著迷', photo: 'https://i.ibb.co/hFCWvZkq/213.jpg' },
  { id: '214-陳竑智-校花', category: '校花', classNum: '214', name: '陳竑智', ig: '@horacechen1125', reason: '充滿氣質與魅力，傲嬌' },
  { id: '215-蕭學寓-校花', category: '校花', classNum: '215', name: '蕭學寓', ig: '@snowfish_0219', reason: '可愛黑皮小蘿莉', photo: 'https://i.ibb.co/tMGd4P7z/215.jpg' },
  { id: '216-蔡士捷-校花', category: '校花', classNum: '216', name: '蔡士捷', ig: '@walrusqqq', reason: '他會跟別人一起去日本，還會留草莓顆粒給別人吃', photo: 'https://i.ibb.co/VchxXjvF/216.jpg' },
  { id: '217-賴柚樺-校花', category: '校花', classNum: '217', name: '賴柚樺', ig: '@luke._.0315' },
  { id: '218-林煒芢-校花', category: '校花', classNum: '218', name: '林煒芢', ig: '@anon_tokyo._.william', reason: '騷', photo: 'https://i.ibb.co/KzRcMrC4/218.jpg' },
  { id: '219-邱琬婷-校花', category: '校花', classNum: '219', name: '邱琬婷', ig: '未提供' },
  { id: '221-施竣揚-校花', category: '校花', classNum: '221', name: '施竣揚', ig: '@yang_.511_dd', reason: '中華民國國民大會受全體國民之付託，依據孫中山先生創立中華民國遺教，為鞏固國權，奠定社會安寧，故推舉一位coser競逐校花', photo: 'https://i.ibb.co/Wvn3GP5d/221.jpg' },
  { id: '225-林隆諺-校花', category: '校花', classNum: '226', name: '林隆諺', ig: '@michael120tw', reason: '氣質高冷', photo: 'https://i.ibb.co/gn1SfbJ/226.jpg' },

  // 校猴
  { id: '101-劉勳立-校猴', category: '校猴', classNum: '101', name: '劉勳立', ig: '@_lsl_rr' },
  { id: '109-許力威-校猴', category: '校猴', classNum: '109', name: '許力威', ig: '@wei03_hsu31', reason: '幾乎什麼好事都做過了 愛嘴人' },
  { id: '110-何柏勳-校猴', category: '校猴', classNum: '110', name: '何柏勳', ig: '@bohsun._.1002', reason: '一中89猴🙂‍↕️🙂‍↕️ 一臉就猴猴的', photo: 'https://i.ibb.co/mCdFKVxx/110.jpg' },
  { id: '110-馬銘寬-校猴', category: '校猴', classNum: '110', name: '馬銘寬', ig: '@takagisannnnnn', reason: '我男友', photo: 'https://i.ibb.co/zVGGQKr7/110.jpg' },
  { id: '110-許鎧鴻-校猴', category: '校猴', classNum: '110', name: '許鎧鴻', ig: '忘記了', reason: '超級糖 糖王當之無愧' },
  { id: '110-楊裕翔-校猴', category: '校猴', classNum: '110', name: '楊裕翔', ig: '@_1_muv.2_0', reason: '他最近在挑戰在高空吃香蕉', photo: 'https://i.ibb.co/LdxGrKQW/110.jpg' },
  { id: '112-陳睿勳-校猴', category: '校猴', classNum: '112', name: '陳睿勳', ig: '@muk49aa_', reason: '超愛67, 憨仔', photo: 'https://i.ibb.co/hRrWrzws/112.jpg' },
  { id: '112-鄒東哲-校猴', category: '校猴', classNum: '112', name: '鄒東哲', ig: '@ipzz_002__', reason: '有點憨 上課一直讓大家笑', photo: 'https://i.ibb.co/N2N1Lc5X/112.jpg' },
  { id: '119-李文揚-校猴', category: '校猴', classNum: '119', name: '李文揚', ig: '@lee_wen_yang', reason: '之前翻牆被教官抓到直接爆氣、在宿舍半夜亂叫、課程上手機被老師沒收直接偷拿回來、段考日偷跑回宿舍睡覺', photo: 'https://i.ibb.co/9mstqnyF/119.jpg' },
  { id: '120-黃紀翔-校猴', category: '校猴', classNum: '120', name: '黃紀翔', ig: '未提供', reason: '傳奇之人, 舍幹6️⃣7️⃣, 舍幹包一包' },
  { id: '121-張友騰-校猴', category: '校猴', classNum: '121', name: '張友騰', ig: '@ccc_thomas', reason: '段考在景賢樓怒吼、耽誤別人上台大、下課帥氣扣籃、我要日幣', photo: 'https://i.ibb.co/YFQ8fGvc/121.jpg' },
  { id: '203-洪靖安-校猴', category: '校猴', classNum: '203', name: '洪靖安', ig: '@ij_ij_oaix_muidohr', reason: '可愛', photo: 'https://i.ibb.co/SD3dHb2K/203.jpg' },
  { id: '209-吳侑霖-校猴', category: '校猴', classNum: '209', name: '吳侑霖', ig: '@andrew.0780' },
  { id: '209-張弋安-校猴', category: '校猴', classNum: '209', name: '張弋安', ig: '未提供', reason: '全校一起打雀魂' },
  { id: '219-許睿哲-校猴', category: '校猴', classNum: '219', name: '許睿哲', ig: '@che1024_', reason: '他的腳趾很強' },
];

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode; color: string; bgColor: string; step: number }[] = [
  { id: '校草', label: '校草 🤴', icon: <Crown className="size-6" />, color: 'text-blue-400', bgColor: 'bg-blue-400/10 border-blue-400', step: 1 },
  { id: '校花', label: '校花 🌸', icon: <Flower2 className="size-6" />, color: 'text-pink-400', bgColor: 'bg-pink-400/10 border-pink-400', step: 2 },
  { id: '校猴', label: '校猴 🐒', icon: <Ghost className="size-6" />, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10 border-yellow-400', step: 3 },
];

export default function App() {
  const [step, setStep] = useState(0); 
  const [votes, setVotes] = useState<Record<Category, Nominee[]>>({
    '校草': [],
    '校花': [],
    '校猴': []
  });
  const [honeypot, setHoneypot] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeLightbox, setActiveLightbox] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const toggleVote = (category: Category, nominee: Nominee) => {
    setVotes(prev => {
      const currentVotes = prev[category];
      const isSelected = currentVotes.some(v => v.id === nominee.id);
      
      if (isSelected) {
        return { ...prev, [category]: currentVotes.filter(v => v.id !== nominee.id) };
      } else {
        if (currentVotes.length >= 2) return prev;
        return { ...prev, [category]: [...currentVotes, nominee] };
      }
    });
  };

  useEffect(() => {
    let retryTimer: number;

    const initializeGoogle = () => {
      if (step === 4 && !user && window.google?.accounts?.id) {
        try {
          if (!window.__googleInitDone) {
            window.__googleInitDone = true;
            window.google.accounts.id.initialize({
              client_id: GOOGLE_CLIENT_ID,
              callback: (res: any) => {
                const base64Url = res.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
                  '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join(''));
                const payload = JSON.parse(jsonPayload);
                
                setUser({ 
                  email: payload.email, 
                  name: payload.name, 
                  picture: payload.picture, 
                  credential: res.credential 
                });
              }
            });
          }

          const btnDiv = document.getElementById("google-signin-btn");
          // Always try to render if the div exists and is empty
          if (btnDiv && btnDiv.innerHTML === '') {
            window.google.accounts.id.renderButton(btnDiv, { 
              theme: "filled_black", 
              size: "large", 
              shape: "pill", 
              width: "300" 
            });
            if (retryTimer) clearInterval(retryTimer);
          }
        } catch (err) {
          console.error("Google Init Error:", err);
        }
      }
    };

    initializeGoogle();

    if (step === 4 && !user) {
      retryTimer = window.setInterval(initializeGoogle, 500);
    }

    return () => {
      if (retryTimer) clearInterval(retryTimer);
    };
  }, [step, user]);

  const isSchoolAccount = user?.email.toLowerCase().trim().endsWith('@std.tcfsh.tc.edu.tw') || user?.email.toLowerCase().trim() === 'tcfshcboy@gmail.com';

  const handleSubmit = async () => {
    if (honeypot !== '') { setStep(5); return; }
    if (!user || !isSchoolAccount) return;
    setIsSubmitting(true);
    
    // 將收集到的資料格式化，提取 id 傳送給 GAS，並附上 credential 以便後端驗證資安
    const payload = {
      userEmail: user.email,
      userName: user.name,
      credential: user.credential, // 送出 Google Token
      votes: {
        '校草': votes['校草'].map(v => v.id),
        '校花': votes['校花'].map(v => v.id),
        '校猴': votes['校猴'].map(v => v.id)
      },
      timestamp: new Date().toISOString()
    };

    try {
      if (GOOGLE_SCRIPT_URL === "YOUR_GAS_WEB_APP_URL") {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStep(5);
      } else {
        // 移除 no-cors，改以一般的跨域連線。GAS 在接收 text/plain 時支援簡單請求 (Simple Request)，可以讀取回傳值。
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST", 
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });
        
        try {
          const textResult = await response.text();
          try {
            const result = JSON.parse(textResult);
            if (result.status === 'error') {
              alert("投票失敗：" + result.message);
              setIsSubmitting(false);
              return;
            }
            setStep(5);
          } catch (jsonError) {
            console.error("解析回應發生錯誤:", jsonError);
            console.error("GAS 伺服器原始回應內容:", textResult);
            if (textResult.includes("<html")) {
              alert("伺服器回應了網頁 (HTML) 而非 JSON 資料。\n這通常是因為：\n1. 您的 GAS 沒有設定為「執行身分：我(Me)」或「誰可以存取：所有人(Anyone)」。\n2. 您在 GAS 更改了程式碼但沒有發布「新版本」的部署。\n請按 F12 查看 Console 內的原始回應了解詳情。");
            } else {
              alert("伺服器回應異常，請檢查 GAS 部署設定是否正確 (例如權限是否設為所有人)。");
            }
            setIsSubmitting(false);
          }
        } catch (e) {
          console.error("網路連線發生錯誤:", e);
          alert("網路連線異常，請確認伺服器狀態。");
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      console.error(err);
      alert("傳送失敗，請檢查網路連線。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 5) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center size-24 rounded-full bg-lime-400/20 text-lime-400">
            <CheckCircle2 className="size-12" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400 mb-2">投票成功！</h1>
            <p className="text-zinc-400 font-mono mt-4 text-lg">
              🍡您已完成投票 ! 敬請期待投票結果~<br/>也趕快告訴大家來投票吧 !
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-zinc-800 text-zinc-300 font-bold rounded-2xl hover:bg-zinc-700 transition"
          >
            返回首頁
          </button>
        </motion.div>
      </div>
    );
  }

  const renderVotingGrid = (categoryName: Category) => {
    const catConfig = CATEGORIES.find(c => c.id === categoryName)!;
    const categoryNominees = NOMINEES.filter(n => n.category === categoryName);
    
    return (
      <motion.div 
        key={`step-${catConfig.step}`}
        initial={{ x: 20, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        exit={{ x: -20, opacity: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-black/20 ${catConfig.color}`}>
              {catConfig.icon}
            </div>
            <div>
              <h2 className={`text-2xl font-black ${catConfig.color}`}>{catConfig.label}</h2>
              <p className="text-sm text-zinc-400 mt-1">請點擊投票 (已選 {votes[categoryName].length}/2)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categoryNominees.map(nominee => {
            const isSelected = votes[categoryName].some(v => v.id === nominee.id);
            const isDisabled = !isSelected && votes[categoryName].length >= 2;
            const defaultPhoto = categoryName === '校草' ? 'https://i.ibb.co/7x5XrrwS/cboy.png' : categoryName === '校花' ? 'https://i.ibb.co/N2CrKjcR/cboy.png' : 'https://i.ibb.co/Cp3Tr80Z/cboy.png';
            const photoUrl = nominee.photo || defaultPhoto;
            
            return (
              <button
                key={nominee.id}
                onClick={() => toggleVote(categoryName, nominee)}
                disabled={isDisabled}
                className={`relative group rounded-3xl border-2 transition-all flex flex-col items-start overflow-hidden text-left w-full
                  ${isSelected 
                    ? `${catConfig.bgColor} border-current shadow-[0_0_20px_rgba(255,255,255,0.05)]` 
                    : isDisabled 
                      ? 'bg-zinc-950 border-zinc-900 opacity-60 cursor-not-allowed'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80'
                  }`}
              >
                {/* Photo Area */}
                <div className="w-full aspect-square sm:aspect-[4/3] bg-zinc-950 relative overflow-hidden flex items-center justify-center shrink-0 border-b border-zinc-800/50">
                  {/* Option 2: Blurred background photo copy */}
                  <img 
                    src={photoUrl} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110 select-none pointer-events-none" 
                  />
                  {/* Centered complete/contained photo */}
                  <img 
                    src={photoUrl} 
                    alt={nominee.name} 
                    loading="lazy" 
                    className={`relative z-10 max-h-full max-w-full object-contain transition-transform duration-500 ${!isDisabled && !isSelected && 'group-hover:scale-105'} ${!nominee.photo && 'opacity-80'}`} 
                  />
                  
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                      <div className={`size-16 rounded-full flex items-center justify-center ${catConfig.color} bg-black/80 shadow-xl border border-current`}>
                         <CheckCircle2 className="size-8" />
                      </div>
                    </div>
                  )}
                  
                  {/* Floating tags */}
                  <div className="absolute top-3 left-3 flex gap-2 z-20">
                    <span className={`inline-flex items-center text-xs font-black px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white border border-white/10 shadow-sm`}>
                      {nominee.classNum} 班
                    </span>
                  </div>

                  {/* Option 1 & 2 premium optimization: Easy one-click full-screen Lightbox trigger */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLightbox(photoUrl);
                    }}
                    className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-lime-400 hover:text-white border border-white/10 shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                    title="放大觀看完整相片"
                  >
                    <Maximize2 className="size-3.5" />
                    <span>放大</span>
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col gap-3 w-full flex-grow">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-black text-2xl ${isSelected ? 'text-white' : 'text-zinc-100'}`}>
                      {nominee.name}
                    </h3>
                  </div>
                  
                  {nominee.ig && nominee.ig !== '未提供' && nominee.ig !== '忘記了' && nominee.ig !== '高冷男神拒絕社群' && (
                    <div className="flex items-center gap-1.5 text-pink-400 font-mono text-sm bg-pink-400/10 px-2.5 py-1 rounded-lg w-fit">
                      <Instagram className="size-4 flex-shrink-0" />
                      <span className="font-bold">追蹤：</span>
                      <span className="truncate">{nominee.ig}</span>
                    </div>
                  )}

                  {nominee.reason && (
                    <div className="flex items-start gap-1.5 text-cyan-400 text-sm bg-cyan-400/10 px-2.5 py-2 rounded-lg w-full mt-auto">
                      <span className="font-bold whitespace-nowrap flex-shrink-0">薦言：</span>
                      <span className="line-clamp-3 leading-snug flex-grow text-cyan-100">{nominee.reason}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={() => setStep(step - 1)} 
            className="flex-1 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft size={20} /> 上一頁
          </button>
          <button 
            onClick={() => setStep(step + 1)} 
            className="flex-1 py-4 bg-lime-400 text-black font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            下一頁 <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 selection:bg-lime-400/30">
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-5xl xl:max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🗳️</span>
            <span className="font-black tracking-tighter text-base sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-cyan-400">
              2026 TCFSH 校園風雲人物票選
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block h-1.5 w-32 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-lime-400" 
                animate={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-zinc-500">
              {step === 0 ? '投票說明' : step === 4 ? '確認與送出' : `${CATEGORIES[step-1].id}票選`}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="step0"
              initial={{ x: -20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: 20, opacity: 0 }}
              className="space-y-8 max-w-3xl mx-auto"
            >
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-black leading-[1.2] tracking-tight text-white">
                  <span className="block mb-1">決定你心目中的</span>
                  <span className="text-cyan-400 underline decoration-cyan-400/30 block">
                    TCFSH 校園風雲人物！
                  </span>
                  <span className="text-lime-400 text-2xl">🍡歡迎回報問題與更新照片、資訊欄位!</span>
                </h1>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                  <Info className="text-lime-400 size-6" />
                  <h3 className="text-xl font-black text-zinc-100">投票說明與規範</h3>
                </div>
                
                <ul className="space-y-6 text-zinc-100 font-medium leading-relaxed">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 size-8 rounded-full bg-zinc-800 flex items-center justify-center font-black text-lime-400">1</span>
                    <p>投票對象限為中一中在校學生。每人於各項目（校草、校花、校猴）皆可投出 <strong className="text-lime-400">最多 2 票</strong> 給您心中的風雲人物，亦可選擇不投（0票）。</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 size-8 rounded-full bg-zinc-800 flex items-center justify-center font-black text-lime-400">2</span>
                    <p>為防範灌票，必須登入 <strong className="text-cyan-400">@std.tcfsh.tc.edu.tw</strong> 學校信箱進行投票。若經系統判定使用私人帳號登入，該票將視為無效且不予計票。</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 size-8 rounded-full bg-zinc-800 flex items-center justify-center font-black text-lime-400">3</span>
                    <p>每位同學 <strong className="text-lime-400">僅有一次登入投票機會</strong>，送出後無法再次修改或重複登入投票，請謹慎選擇。</p>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setStep(1)} 
                  className="w-full h-16 bg-gradient-to-r from-lime-400 to-cyan-400 text-black font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(163,230,53,0.15)]"
                >
                  同意投票規則並開始 <ChevronRight size={24} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && renderVotingGrid('校草')}
          {step === 2 && renderVotingGrid('校花')}
          {step === 3 && renderVotingGrid('校猴')}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ x: 20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              <h2 className="text-2xl font-black">您的 <span className="text-lime-400">投票選擇</span></h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CATEGORIES.map(cat => (
                  <div key={cat.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={cat.color}>{cat.icon}</span>
                      <h4 className={`font-black ${cat.color}`}>{cat.id}</h4>
                    </div>
                    {votes[cat.id].length > 0 ? (
                      <ul className="space-y-3">
                        {votes[cat.id].map(v => (
                          <li key={v.id} className="flex justify-between items-center bg-black/50 p-3 rounded-xl border border-zinc-800/50">
                            <span className="font-bold text-white">{v.name}</span>
                            <span className="text-xs font-mono text-zinc-300 bg-zinc-800 px-2 py-1 rounded">{v.classNum}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-950 text-center">
                        <span className="text-sm font-bold text-zinc-400">無投票 (0票)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 relative z-10 ${
                user 
                  ? isSchoolAccount ? 'bg-zinc-900 border-lime-400/20' : 'bg-red-950/20 border-red-500/50' 
                  : 'bg-zinc-950 border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.1)]'
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-400/10 text-cyan-400">
                      <ShieldCheck className="size-6" />
                    </div>
                    <span className="font-black text-xl text-white">一中生身分驗證</span>
                  </div>
                  {user && isSchoolAccount && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-lime-400/50 bg-lime-400/10 text-lime-400 font-bold text-xs">
                      <UserCheck className="size-3" /> 認證通過
                    </div>
                  )}
                </div>

                {!user ? (
                  <div className="space-y-6 relative z-20">
                    <p className="text-sm text-zinc-200 text-center font-bold">請使用 TCFSH 帳號登入送出投票</p>
                    <div className="flex justify-center relative pointer-events-auto">
                      <div id="google-signin-btn" className="h-12 flex justify-center w-[300px]"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`flex items-center justify-between bg-black/40 p-4 rounded-2xl border ${isSchoolAccount ? 'border-zinc-800' : 'border-red-900/50 bg-red-950/30'}`}>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={user.picture} className="size-12 rounded-full border-2 border-zinc-800" alt="avatar" />
                          <div className={`absolute -bottom-1 -right-1 size-5 border-2 border-zinc-900 rounded-full flex items-center justify-center ${isSchoolAccount ? 'bg-lime-400' : 'bg-red-500'}`}>
                            {isSchoolAccount ? <CheckCircle2 className="size-3 text-black" /> : <ShieldAlert className="size-3 text-white" />}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-sm">{user.name}</span>
                          <span className={`text-[10px] font-mono ${isSchoolAccount ? 'text-zinc-500' : 'text-red-400 font-bold'}`}>{user.email}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setUser(null)} 
                        className="size-10 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
                      >
                        <LogOut size={18}/>
                      </button>
                    </div>

                    {!isSchoolAccount && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-start gap-2">
                        <AlertTriangle className="size-5 shrink-0" />
                        <p>這不是學校帳號！🍡系統已阻擋非 @std.tcfsh.tc.edu.tw 之帳號進行投票。請登出並切換帳號。</p>
                      </div>
                    )}
                  </div>
                )}
                
                <input type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(3)} 
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold rounded-2xl hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                  返回修改
                </button>
                {user && isSchoolAccount && (
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting} 
                    className="flex-[2] h-[56px] bg-gradient-to-r from-lime-400 to-cyan-400 text-black font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(163,230,53,0.2)] disabled:opacity-50 disabled:grayscale"
                  >
                    {isSubmitting ? '正在寫入資料庫...' : <><Send size={20} /> 送出投票</>}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-lime-400 via-cyan-400 to-lime-400" />

      {/* 燈箱放大功能 (AnimatePresence) */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightbox(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
          >
            {/* 關閉按鈕 */}
            <button 
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-[110] p-3 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-all hover:scale-110 active:scale-95"
              aria-label="關閉"
            >
              <X className="size-6" />
            </button>
            
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative max-w-full max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activeLightbox} 
                alt="完整相片" 
                className="max-w-[95vw] md:max-w-[80vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-zinc-800"
              />
            </motion.div>
            <p className="text-zinc-500 text-sm mt-4 font-black font-semi tracking-wider animate-pulse select-none">
              點擊隨處即可關閉
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
