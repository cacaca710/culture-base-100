// 山海匯聚 — 中臺灣百頁共創計畫
// 資料來源:第 1 屆百大文化基地獲選名單(文化部)

// 縣市對照:SVG path id 與展示資訊
const COUNTIES = {
  "臺北市": { id: "TW-TPE" },
  "新北市": { id: "TW-NWT" },
  "基隆市": { id: "TW-KEE" },
  "宜蘭縣": { id: "TW-ILA" },
  "桃園市": { id: "TW-TAO" },
  "新竹市": { id: "TW-HSZ" },
  "新竹縣": { id: "TW-HSQ" },
  "苗栗縣": { id: "TW-MIA" },
  "臺中市": { id: "TW-TXG", focus: true, color: "#3fb6cd", colorSoft: "#d3eef4", label: "台中" },
  "彰化縣": { id: "TW-CHA", focus: true, color: "#ef9b84", colorSoft: "#fbe6df", label: "彰化" },
  "南投縣": { id: "TW-NAN", focus: true, color: "#84bf41", colorSoft: "#e4f1d3", label: "南投" },
  "雲林縣": { id: "TW-YUN", focus: true, color: "#eecb2f", colorSoft: "#faf0c4", label: "雲林" },
  "嘉義縣": { id: "TW-CYQ" },
  "嘉義市": { id: "TW-CYI" },
  "臺南市": { id: "TW-TNN" },
  "高雄市": { id: "TW-KHH" },
  "屏東縣": { id: "TW-PIF" },
  "花蓮縣": { id: "TW-HUA" },
  "臺東縣": { id: "TW-TTT" },
  "澎湖縣": { id: "TW-PEN" },
  "金門縣": { id: "TW-KIN" },
  "連江縣": { id: "TW-LIE" }
};

// 申請類別
const CATS = {
  craft:     { name: "文創聚落或工藝據點",             short: "工藝聚落", icon: "◈" },
  museum:    { name: "博物館、地方文化館",             short: "地方文化館", icon: "◍" },
  arts:      { name: "視覺藝術、表演藝術等藝文展演據點", short: "藝文展演", icon: "◐" },
  heritage:  { name: "古蹟、聚落或文化路徑點",         short: "古蹟路徑", icon: "◒" },
  bookstore: { name: "獨立書店、雜誌社或出版社",       short: "獨立書店", icon: "◫" },
  community: { name: "社區營造點或地方創生點",         short: "地方創生", icon: "◎" },
  film:      { name: "影視據點",                       short: "影視據點", icon: "◉" }
};

// 第 1 屆百大文化基地獲選名單(110 處)
const BASES = [
  { no: 1,   name: "日星鑄字行", org: "日星鑄字行", cat: "craft", county: "臺北市", link: { url: "https://www.letterpress.org.tw/", type: "website" } },
  { no: 2,   name: "北投文物館", org: "財團法人福祿文化基金會北投文物館", cat: "museum", county: "臺北市", link: { url: "https://beitoumuseum.org.tw/", type: "website" } },
  { no: 3,   name: "牯嶺街小劇場", org: "身體氣象館", cat: "arts", county: "臺北市", link: { url: "https://www.glt.org.tw/", type: "website" } },
  { no: 4,   name: "紀州庵文學森林", org: "財團法人台灣文學發展基金會", cat: "heritage", county: "臺北市", link: { url: "https://kishuan.org.tw/", type: "website" } },
  { no: 5,   name: "郭怡美書店", org: "郭怡美書店", cat: "bookstore", county: "臺北市", link: { url: "https://www.facebook.com/profile.php?id=100087042986727", type: "facebook" } },
  { no: 6,   name: "渭水驛站", org: "財團法人蔣渭水文化基金會", cat: "heritage", county: "臺北市", link: { url: "https://www.facebook.com/WeiShuiStation/", type: "facebook" } },
  { no: 7,   name: "萬座曉劇場", org: "曉劇場", cat: "arts", county: "臺北市", link: { url: "https://www.shinehousetheatre.com/", type: "website" } },
  { no: 8,   name: "甘樂文創合習聚落", org: "甘樂文創志業股份有限公司", cat: "community", county: "新北市", link: { url: "https://www.thecan.com.tw/", type: "website" } },
  { no: 9,   name: "李梅樹紀念館", org: "李梅樹紀念館", cat: "museum", county: "新北市", link: { url: "https://limeishu.org.tw/", type: "website" } },
  { no: 10,  name: "朱銘美術館", org: "財團法人朱銘文教基金會", cat: "museum", county: "新北市", link: { url: "https://www.juming.org.tw/", type: "website" } },
  { no: 11,  name: "板橋放送所", org: "財團法人新北市當代傳奇文化藝術基金會", cat: "arts", county: "新北市", link: { url: "https://www.cltartech.com.tw/", type: "website" } },
  { no: 12,  name: "猴硐礦工文史館", org: "新北市猴硐礦工文史協會", cat: "museum", county: "新北市", link: { url: "https://www.facebook.com/profile.php?id=100064196825097", type: "facebook" } },
  { no: 13,  name: "雲門劇場", org: "財團法人雲門文化藝術基金會", cat: "arts", county: "新北市", link: { url: "https://www.cloudgate.org.tw/cgt", type: "website" } },
  { no: 14,  name: "新北市中和緬甸街區", org: "迴鄉辣東南亞文化推廣工作室", cat: "community", county: "新北市" },
  { no: 15,  name: "新平溪煤礦博物園區", org: "新平溪煤礦股份有限公司", cat: "museum", county: "新北市", link: { url: "https://www.taiwancoal.com.tw/web/", type: "website" } },
  { no: 16,  name: "見書店", org: "見一文化有限公司", cat: "bookstore", county: "基隆市", link: { url: "https://www.facebook.com/seatoseebookafe/", type: "facebook" } },
  { no: 17,  name: "星濱山共創工作室", org: "星濱山共創工作室", cat: "community", county: "基隆市", link: { url: "https://www.zhengbinart.com/", type: "website" } },
  { no: 18,  name: "大二結社區(二結穀倉稻農文化館)", org: "財團法人大二結文化基金會", cat: "heritage", county: "宜蘭縣", link: { url: "https://erjiebarn.darj.org.tw/", type: "website" } },
  { no: 19,  name: "小鎮職人-藝驛頭城文化基地", org: "蘭城巷弄有限公司", cat: "community", county: "宜蘭縣" },
  { no: 20,  name: "白米木屐村", org: "保證責任宜蘭縣蘇澳鎮白米社區合作社", cat: "museum", county: "宜蘭縣", link: { url: "https://www.baimiclogs.com", type: "website" } },
  { no: 21,  name: "利澤國際偶戲藝術村", org: "利澤國際文化有限公司", cat: "museum", county: "宜蘭縣", link: { url: "https://lizepuppet.com.tw/", type: "website" } },
  { no: 22,  name: "來宜蘭迺菜市場", org: "來宜蘭迺菜市場", cat: "community", county: "宜蘭縣", link: { url: "https://www.facebook.com/YoungGrandpa/", type: "facebook" } },
  { no: 23,  name: "大溪老茶廠", org: "大溪老茶廠", cat: "museum", county: "桃園市", link: { url: "https://www.daxitea.com/tw/", type: "website" } },
  { no: 24,  name: "桃園米倉劇場", org: "埜遊文化有限公司", cat: "arts", county: "桃園市", link: { url: "https://www.facebook.com/barn169theater/", type: "facebook" } },
  { no: 25,  name: "源古本舖", org: "古裕發商號", cat: "museum", county: "桃園市", link: { url: "https://www.facebook.com/taiwanchic919/", type: "facebook" } },
  { no: 26,  name: "見域工作室", org: "見域工作室", cat: "bookstore", county: "新竹市", link: { url: "https://www.hsin-story.com/", type: "website" } },
  { no: 27,  name: "或者新州屋", org: "鴻梅文創志業股份有限公司", cat: "craft", county: "新竹市", link: { url: "https://www.orlifestyles.com/", type: "website" } },
  { no: 28,  name: "絕版影像館 UP Gallery", org: "絕版影像館 UP Gallery", cat: "arts", county: "新竹市", link: { url: "https://uniquephoto.com.tw/en/", type: "website" } },
  { no: 29,  name: "新竹東門市場", org: "新竹東門市場自治會", cat: "community", county: "新竹市", link: { url: "https://www.facebook.com/TumgmenMarket/", type: "facebook" } },
  { no: 30,  name: "大山北月", org: "大山北月有限公司", cat: "community", county: "新竹縣", link: { url: "https://www.bighillnorthmoon.tw/", type: "website" } },
  { no: 31,  name: "北埔是一座慢漫博物館", org: "藍鵲書房", cat: "bookstore", county: "新竹縣", link: { url: "https://www.facebook.com/bookbluemagpie/", type: "facebook" } },
  { no: 32,  name: "姜阿新洋樓", org: "財團法人姜阿新教育基金會", cat: "museum", county: "新竹縣", link: { url: "https://chiangashing.wixsite.com/2018", type: "website" } },
  { no: 33,  name: "臺紅茶業文化館", org: "台灣紅茶股份有限公司", cat: "museum", county: "新竹縣", link: { url: "https://www.forteaco.com.tw/", type: "website" } },
  { no: 34,  name: "蕭如松藝術園區", org: "昊業公關顧問有限公司", cat: "museum", county: "新竹縣", link: { url: "https://www.facebook.com/hsiaojusun/", type: "facebook" } },
  { no: 35,  name: "九湖森林休閒農場(銅鑼茶廠)", org: "九湖森林休閒農場(銅鑼茶廠)", cat: "craft", county: "苗栗縣", link: { url: "https://www.tongluotea.com/", type: "website" } },
  { no: 36,  name: "苑裡掀海風", org: "苑裡掀海風", cat: "bookstore", county: "苗栗縣", link: { url: "https://www.facebook.com/taketheseawind/", type: "facebook" } },
  { no: 37,  name: "卓也小屋天然手作有限公司", org: "卓也小屋天然手作有限公司", cat: "craft", county: "苗栗縣", link: { url: "https://www.joye.com.tw/", type: "website" } },
  { no: 38,  name: "農村工藝生活館", org: "台灣藺草學會", cat: "craft", county: "苗栗縣", link: { url: "https://www.facebook.com/Shanjiao.sjc/", type: "facebook" } },
  { no: 39,  name: "銅鑼窯", org: "銅鑼窯", cat: "craft", county: "苗栗縣", link: { url: "https://www.facebook.com/TongluoKiln/", type: "facebook" } },
  { no: 40,  name: "中央書局", org: "財團法人上善人文基金會", cat: "bookstore", county: "臺中市", link: { url: "https://www.facebook.com/centralbook.1927/", type: "facebook" } },
  { no: 41,  name: "月眉糖廠糖業文化路徑文化基地", org: "如山文創有限公司", cat: "heritage", county: "臺中市" },
  { no: 42,  name: "北屯新村-臺中市眷村文物館", org: "兩果文化創意有限公司", cat: "museum", county: "臺中市", link: { url: "https://www.facebook.com/go.tmkvm/", type: "facebook" } },
  { no: 43,  name: "富興工廠 1962", org: "富興工廠文化有限公司", cat: "craft", county: "臺中市", link: { url: "https://www.fusionspace1962.com/", type: "website" } },
  { no: 44,  name: "臺中市霧峰區桐林社區發展協會", org: "臺中市霧峰區桐林社區發展協會", cat: "community", county: "臺中市", link: { url: "https://www.facebook.com/wftonglin/", type: "facebook" } },
  { no: 45,  name: "霧峰林家宮保第園區", org: "霧峰林家宮保第園區(林本堂股份有限公司)", cat: "heritage", county: "臺中市", link: { url: "https://www.wufenglins.com.tw/", type: "website" } },
  { no: 46,  name: "八堡圳頭文化創生行動基地", org: "彰化縣二水鄉源泉社區發展協會", cat: "community", county: "彰化縣", link: { url: "https://ycc.org.tw/ycc/index.php?action=index", type: "website" } },
  { no: 47,  name: "王功海牛文化基地", org: "王功海牛文化基地", cat: "community", county: "彰化縣" },
  { no: 48,  name: "田中窯創意園區", org: "久藝窯業有限公司", cat: "craft", county: "彰化縣", link: { url: "https://www.facebook.com/profile.php?id=100063586455993", type: "facebook" } },
  { no: 49,  name: "長源醫院—鹿港歷史影像館", org: "雄本老屋規劃有限公司", cat: "museum", county: "彰化縣", link: { url: "https://www.facebook.com/profile.php?id=100068402070339", type: "facebook" } },
  { no: 50,  name: "洛津組合-鹿港大街創生基地", org: "鹿港囝仔文化事業有限公司", cat: "community", county: "彰化縣", link: { url: "https://tkfl.tw/", type: "website" } },
  { no: 51,  name: "日月老茶廠", org: "台灣農林股份有限公司南投分公司", cat: "museum", county: "南投縣", link: { url: "https://www.assamteafarm.com.tw/", type: "website" } },
  { no: 52,  name: "水里蛇窯陶藝文化園區", org: "水里蛇窯陶藝文化園區", cat: "community", county: "南投縣", link: { url: "https://www.snakekiln.com.tw/", type: "website" } },
  { no: 53,  name: "南投戲院", org: "南投戲院", cat: "film", county: "南投縣", link: { url: "https://www.nantoutheater.com/", type: "website" } },
  { no: 54,  name: "紙教堂新故鄉見學園區", org: "財團法人新故鄉文教基金會", cat: "community", county: "南投縣", link: { url: "https://paperdome.org.tw/", type: "website" } },
  { no: 55,  name: "廣興紙寮", org: "廣鴻興有限公司", cat: "museum", county: "南投縣", link: { url: "https://www.taiwanpaper.net/", type: "website" } },
  { no: 56,  name: "毓繡美術館", org: "財團法人毓繡文化基金會", cat: "arts", county: "南投縣", link: { url: "https://www.yu-hsiu.org/", type: "website" } },
  { no: 57,  name: "西螺生態博物館", org: "財團法人雲林縣螺陽文教基金會", cat: "museum", county: "雲林縣", link: { url: "https://www.facebook.com/siluo.yenping.museum/", type: "facebook" } },
  { no: 58,  name: "虎尾建國眷村", org: "雲林縣虎尾鎮建國眷村再造協會", cat: "heritage", county: "雲林縣", link: { url: "https://www.jianguohuwei.com/", type: "website" } },
  { no: 59,  name: "雲林記憶 Cool", org: "社團法人台灣公益 CEO 協會", cat: "heritage", county: "雲林縣", link: { url: "https://www.facebook.com/Yunlin.memorycool/", type: "facebook" } },
  { no: 60,  name: "雲林故事館", org: "社團法人雲林縣雲林故事人協會", cat: "museum", county: "雲林縣", link: { url: "http://www.ylstoryhouse.org.tw", type: "website" } },
  { no: 61,  name: "雲林布袋戲館", org: "雲林布袋戲館", cat: "museum", county: "雲林縣", link: { url: "https://sites.google.com/view/yunlinpuppet", type: "website" } },
  { no: 62,  name: "大林慢城發展協會", org: "嘉義縣大林慢城發展協會", cat: "craft", county: "嘉義縣", link: { url: "https://www.facebook.com/DalinCittaSlow/", type: "facebook" } },
  { no: 63,  name: "交趾剪黏傳統工藝文化基地", org: "嘉義縣板陶窯文化發展協會", cat: "craft", county: "嘉義縣", link: { url: "https://www.bantaoyao.com/", type: "website" } },
  { no: 64,  name: "阿里山達邦 mayasvi 文化路徑基地", org: "嘉義縣阿里山鄒族達邦庫巴文化發展協會", cat: "heritage", county: "嘉義縣" },
  { no: 65,  name: "洲南鹽場", org: "社團法人嘉義縣布袋嘴文化協會", cat: "museum", county: "嘉義縣", link: { url: "https://taiwansalt.com/", type: "website" } },
  { no: 66,  name: "培桂堂——林開泰診療所舊宅", org: "新港文教基金會", cat: "heritage", county: "嘉義縣", link: { url: "https://www.peiguihall.org.tw/", type: "website" } },
  { no: 67,  name: "優遊吧斯阿里山鄒族文化部落", org: "優遊吧斯股份有限公司", cat: "community", county: "嘉義縣", link: { url: "https://www.yuyupastribe.com/", type: "website" } },
  { no: 68,  name: "阮劇團", org: "阮劇團", cat: "arts", county: "嘉義市", link: { url: "https://ourtheatre.net/", type: "website" } },
  { no: 69,  name: "島呼冊店", org: "島呼冊店", cat: "bookstore", county: "嘉義市", link: { url: "https://www.facebook.com/tofubooks/", type: "facebook" } },
  { no: 70,  name: "舊監更生島", org: "台灣田野工場有限公司", cat: "heritage", county: "嘉義市", link: { url: "https://rebirth-island.com/", type: "website" } },
  { no: 71,  name: "88 藝療所", org: "88 藝療所", cat: "community", county: "臺南市", link: { url: "https://www.facebook.com/profile.php?id=61566808104716", type: "facebook" } },
  { no: 72,  name: "大崎村落創藝基地", org: "台灣城鄉藝農實踐協會", cat: "heritage", county: "臺南市", link: { url: "https://www.facebook.com/da7childartlibrary/", type: "facebook" } },
  { no: 73,  name: "台江十三佃鄭家社區博物館", org: "台江十三佃文化工作室", cat: "heritage", county: "臺南市" },
  { no: 74,  name: "台南林百貨", org: "高青時尚股份有限公司-林百貨", cat: "arts", county: "臺南市", link: { url: "https://www.hayashi.com.tw/", type: "website" } },
  { no: 75,  name: "台灣基督長老教會歷史檔案館", org: "財團法人台灣基督長老教會宣教基金會", cat: "museum", county: "臺南市", link: { url: "https://archives.pct.org.tw/", type: "website" } },
  { no: 76,  name: "版本書店 SüRüM Bookstore", org: "塾日生活文化有限公司", cat: "bookstore", county: "臺南市", link: { url: "https://www.facebook.com/SURUMTAINAN/", type: "facebook" } },
  { no: 77,  name: "臺南新化生活故事博物館(新化老街)", org: "山海屯股份有限公司", cat: "community", county: "臺南市" },
  { no: 78,  name: "曬書店×新營市民學堂", org: "曬書店", cat: "bookstore", county: "臺南市", link: { url: "https://www.facebook.com/2booksite/", type: "facebook" } },
  { no: 79,  name: "三餘文化基地", org: "三餘文化股份有限公司", cat: "bookstore", county: "高雄市", link: { url: "https://www.takaobooks.tw/", type: "website" } },
  { no: 80,  name: "大武壠文化事務所", org: "高雄市杉林區日光小林社區發展協會", cat: "community", county: "高雄市", link: { url: "https://www.facebook.com/SiaolinTaivoan/", type: "facebook" } },
  { no: 81,  name: "橋仔頭糖廠藝術村", org: "橋仔頭白屋股份有限公司", cat: "arts", county: "高雄市", link: { url: "https://www.facebook.com/bywood99/", type: "facebook" } },
  { no: 82,  name: "檨仔腳文化共享空間", org: "高雄市寶來人文協會", cat: "craft", county: "高雄市", link: { url: "https://www.suai-a-ka.com/", type: "website" } },
  { no: 83,  name: "舊打狗驛故事館", org: "春臨臺灣文化事業坊", cat: "museum", county: "高雄市", link: { url: "https://trm.tw/", type: "website" } },
  { no: 84,  name: "小陽。日栽書屋", org: "小陽。日栽書屋", cat: "bookstore", county: "屏東縣", link: { url: "https://www.facebook.com/ssunville/", type: "facebook" } },
  { no: 85,  name: "南排灣的紅寶石-高士佛社", org: "社團法人屏東縣牡丹鄉高士社區發展協會", cat: "heritage", county: "屏東縣", link: { url: "https://www.facebook.com/kuskuscom", type: "facebook" } },
  { no: 86,  name: "「潮州小鎮」建基百年文化聚落", org: "有點衡文創有限公司(幼稚園小書房有機書店)", cat: "community", county: "屏東縣" },
  { no: 87,  name: "禮納里 lnl 原創空間", org: "安可樂創意整合工作室", cat: "craft", county: "屏東縣" },
  { no: 88,  name: "繫。本屋(頭分埔文化工作室)", org: "頭分埔文化工作室", cat: "bookstore", county: "屏東縣", link: { url: "https://www.facebook.com/akauwbooks/", type: "facebook" } },
  { no: 89,  name: "Pising 彼心書店 蔗裡 Ka'oripan 藝文基地", org: "Lis0^so' 你說說工作室", cat: "bookstore", county: "花蓮縣", link: { url: "https://www.facebook.com/pisingbooks/", type: "facebook" } },
  { no: 90,  name: "洄遊吧食魚體驗館", org: "洄遊吧有限公司", cat: "community", county: "花蓮縣", link: { url: "https://www.fishbar.com.tw/main", type: "website" } },
  { no: 91,  name: "璞石咖啡 x 光之島共享基地", org: "財團法人花蓮縣光之島文化藝術基金會", cat: "community", county: "花蓮縣", link: { url: "https://www.facebook.com/jadecafe/", type: "facebook" } },
  { no: 92,  name: "練習曲書店", org: "練習曲文創有限公司", cat: "community", county: "花蓮縣", link: { url: "https://etude.tw/", type: "website" } },
  { no: 93,  name: "豐田大同戲院", org: "社團法人花蓮縣牛犁社區交流協會", cat: "community", county: "花蓮縣", link: { url: "https://www.facebook.com/e7968/", type: "facebook" } },
  { no: 94,  name: "小米學堂", org: "峰忠傳奇有限公司", cat: "museum", county: "臺東縣", link: { url: "https://www.facebook.com/kakituauanpakatuavaqu/", type: "facebook" } },
  { no: 95,  name: "公東的教堂", org: "公東高工", cat: "heritage", county: "臺東縣", link: { url: "https://www.facebook.com/profile.php?id=100063774709210", type: "facebook" } },
  { no: 96,  name: "台灣好基金會池上穀倉藝術館", org: "台灣好基金會 x 池上穀倉藝術館", cat: "arts", county: "臺東縣", link: { url: "https://artchishang.lovelytaiwan.org.tw/barn/home", type: "website" } },
  { no: 97,  name: "台東書書果實 BOOK-BOOK FRUIT TAITUNG", org: "晃晃二手書店", cat: "bookstore", county: "臺東縣", link: { url: "https://www.susubook.com/", type: "website" } },
  { no: 98,  name: "台東糖廠", org: "有限責任台東縣東海岸原住民社區合作社", cat: "craft", county: "臺東縣" },
  { no: 99,  name: "台東縣鹿野鄉永安社區", org: "臺東縣鹿野鄉永安社區發展協會", cat: "community", county: "臺東縣", link: { url: "https://www.facebook.com/pages/%E6%B0%B8%E5%AE%89%E7%A4%BE%E5%8D%80%E7%99%BC%E5%B1%95%E5%8D%94%E6%9C%83-%E9%97%9C%E6%87%B7%E6%93%9A%E9%BB%9E/481656768576338/", type: "facebook" } },
  { no: 100, name: "都蘭國", org: "社團法人臺東縣東河鄉阿度蘭阿美斯文化協進會", cat: "community", county: "臺東縣", link: { url: "https://www.facebook.com/atolan.malakapahay/", type: "facebook" } },
  { no: 101, name: "臺東獵人學校教育基地", org: "財團法人臺東縣獵人學校教育基金會", cat: "community", county: "臺東縣", link: { url: "https://www.hunterschool.com.tw/", type: "website" } },
  { no: 102, name: "先人種下的一朵美麗的花—望安花宅聚落", org: "島嶼情結文化工作室", cat: "heritage", county: "澎湖縣" },
  { no: 103, name: "蔡廷蘭進士第", org: "澎湖縣馬公市興仁社區發展協會", cat: "heritage", county: "澎湖縣", link: { url: "https://www.facebook.com/pages/%E6%BE%8E%E6%B9%96%E8%94%A1%E9%80%B2%E5%A3%AB%E7%AC%AC/487554181646075/", type: "facebook" } },
  { no: 104, name: "澎湖聚落文化創生故事館", org: "沿著菊島文創有限公司(沿菊書店)", cat: "community", county: "澎湖縣", link: { url: "https://www.facebook.com/penghubook/", type: "facebook" } },
  { no: 105, name: "澎湖龜壁港社", org: "澎湖縣湖西鄉南寮社區發展協會", cat: "community", county: "澎湖縣", link: { url: "https://zh-tw.facebook.com/NanliaoPenghu/", type: "facebook" } },
  { no: 106, name: "離島出走 isle.travel studio", org: "離島出走工作室", cat: "community", county: "澎湖縣", link: { url: "https://www.isle.travel/", type: "website" } },
  { no: 107, name: "芹壁社區發展協會", org: "連江縣北竿鄉芹壁社區發展協會", cat: "heritage", county: "連江縣" },
  { no: 108, name: "東引中路客廳", org: "鹹味島工作室", cat: "arts", county: "連江縣", link: { url: "https://www.facebook.com/saltyislandstudio/", type: "facebook" } },
  { no: 109, name: "古崗學校洋樓", org: "古崗社區發展協會", cat: "community", county: "金門縣" },
  { no: 110, name: "僑鄉金門-王慶雲洋樓 1934", org: "甄漾服裝出租", cat: "community", county: "金門縣", link: { url: "https://www.facebook.com/jenayoungkm/", type: "facebook" } }
];

// 文化基地工作坊(4 場)
const WORKSHOPS = [
  {
    session: "場次一", counties: ["臺中市"], tag: "走讀工作坊",
    title: "城市記憶的再生路徑—從知識地景到產業空間",
    date: "7/17", weekday: "五", time: "09:30–16:30",
    venue: "中央書局 × 富興工廠1962"
  },
  {
    session: "場次二", counties: ["彰化縣"], tag: "定點工作坊",
    title: "陶工藝的文化轉譯—從工藝體驗到基地品牌經營",
    date: "8/06", weekday: "四", time: "08:40–16:20",
    venue: "田中窯創藝園區"
  },
  {
    session: "場次三", counties: ["南投縣", "雲林縣"], tag: "跨縣市走讀工作坊",
    title: "地方記憶的跨域策展—從美術館觀看方法到地方記憶展示",
    date: "8/21", weekday: "五", time: "08:40–17:00",
    venue: "毓繡美術館 × 雲林記憶Cool"
  },
  {
    session: "場次四", counties: ["南投縣"], tag: "定點工作坊",
    title: "茶文化的經營與結盟—以五感經驗思考文化體驗與異業結合",
    date: "9/03", weekday: "四", time: "08:30–16:30",
    venue: "日月老茶廠"
  }
];

// 交流會介紹:地方議事桌
const MEETUP_INTRO = {
  lead: "交流分享會議作為工作坊成果之跨場域整合與政策對話平台，啟動「地方議事桌」機制。延續「山海匯聚－人文地景的交織與對話」之整體架構，將四場工作坊所累積之文化路徑成果轉化為跨基地共享知識，透過專題論壇、交流座談及議題討論形式，達成以下目標：",
  goals: [
    { title: "經驗整合與知識轉譯", text: "彙整中彰投雲文化基地於地景敘事、文化路徑設計、社群協力等實務經驗，轉化為可跨區域複製之策略模型。" },
    { title: "議題凝聚與策略共構", text: "針對文化基地永續經營、地方創生、社區營造等核心議題，促進多方對話，形成具體政策建議或行動方向。" },
    { title: "跨區域網絡建立", text: "建立中部與其他縣市文化基地橫向連結，促進資源共享、合作模式建構及長期夥伴關係。" },
    { title: "成果擴散與公共參與", text: "將工作坊成果轉化為公開交流內容，提升文化基地能見度與社會參與度，強化文化治理之公共價值。" }
  ]
};

// 中臺灣文化基地交流會(2 場)
const MEETUPS = [
  {
    session: "場次一", counties: ["雲林縣"],
    title: "文化基地交流分享暨展覽敘事會議",
    date: "10/03", weekday: "六", venue: "創樂子生活學苑"
  },
  {
    session: "場次二", counties: ["彰化縣"],
    title: "文化基地未來行動交流會議",
    date: "11/07", weekday: "六", venue: "彰化生活美學館"
  }
];

// 中臺灣文化百頁行動共創展
const EXPO = {
  title: "中臺灣文化百頁行動共創展",
  slogan: "打開地方未來式",
  dateFrom: "11/7", weekdayFrom: "六",
  dateTo: "11/22", weekdayTo: "日",
  venue: "國立彰化生活美學館 第一、二展覽室",
  time: "9:00–17:00(逢週一休館)",
  series: "濁水沃土之山海匯聚系列",
  counties: ["彰化縣"]
};