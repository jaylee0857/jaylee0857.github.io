-- --------------------------------------------------------
-- 主機:                           127.0.0.1
-- 伺服器版本:                        10.4.14-MariaDB - mariadb.org binary distribution
-- 伺服器作業系統:                      Win64
-- HeidiSQL 版本:                  11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- 傾印 xpark_db 的資料庫結構
CREATE DATABASE IF NOT EXISTS `xpark_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `xpark_db`;

-- 傾印  資料表 xpark_db.ch_events 結構
CREATE TABLE IF NOT EXISTS `ch_events` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sort` int(11) NOT NULL DEFAULT 1,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 正在傾印表格  xpark_db.ch_events 的資料：~5 rows (近似值)
/*!40000 ALTER TABLE `ch_events` DISABLE KEYS */;
INSERT INTO `ch_events` (`id`, `sort`, `title`, `sub_title`, `date`, `image`, `info`, `created_at`, `updated_at`) VALUES
	(1, 1, '小企鵝誕生', 'Xpark麥哲倫家有喜事，小企鵝健康誕生！邀請你一起幫小企鵝取名！', '2020-10-20', '/upload/events_ch/1603545328d1f491a404d6854880943e5c3cd9ca25.jpg', '<p>Xpark誠摯的邀請台灣民眾參與小企鵝命名活動，還有機會獲得超稀有的小禮物唷！</p><p>活動辦法：</p><p>1.小企鵝命名提案募集日為2020/10/12-2020/10/26</p><p>2.命名中選者將可獲得〝超稀有〞禮物一份，還有其他小禮物喔！</p>', '2020-10-24 13:15:28', '2020-10-24 13:15:28'),
	(2, 2, '浪漫特調咖啡', '期間限定開催！Xpark夜間入場獨享浪漫企鵝戀人拿鐵', '2020-10-10', '/upload/events_ch/1603545464a8baa56554f96369ab93e4f3bb068c22.jpg', '<p>專屬夜晚的行程，如今又多加一項啦！</p><p>自10/1早上10:00起可在KKday訂購限定夜間雙人套票(18：00場次)，平日每日限量25組，即可於入場後兌換期間限定的企鵝戀人拉花拿鐵，戀人咖啡只送不賣，僅限網路上進行預購。</p><p>●活動期間：2020/10/12~2020/11/30</p><p>●購票期間：2020/10/01 10：00~2020/11/29 14：59</p><p>讓溫暖的咖啡為兩人的愛情升溫，讓企鵝為你的回憶加分！</p>', '2020-10-24 13:17:44', '2020-10-24 13:17:44'),
	(3, 3, '當季特展', '海洋因塑（素）聯合展', '2020-10-01', '/upload/events_ch/160354577276dc611d6ebaafc66cc0879c71b5db5c.jpg', '<p>本特展串連家、海洋、以及海洋廢棄物議題，包含從國立臺灣科學教育館移展的「海呀！我的家」特展，並規劃加入與國立臺灣師範大學、中國化學會合作辦理「化學元素週期表」特展，將生活中的化學元素概念，除了呈現垃圾過量而造成海洋甚至是地球所面臨的問題，也需讓觀展民眾了解海洋減塑問題外，化學元素於海洋與生活的關係，進而關心化學及海洋環境等議題。<br></p>', '2020-10-24 13:22:52', '2020-10-24 13:22:52'),
	(4, 4, '當季特展', '海洋生態攝影巡迴展', '2020-09-20', '/upload/events_ch/16035458500f28b5d49b3020afeecd95b4009adf4c.jpg', '<p>本展以海生館豐富多樣的水下攝影作品及出版圖鑑收錄之海洋生態影像成果，做為本展資料基礎，展區分為「可愛小丑魚」、「珊瑚的線條」及海生館影像區，張張影像都代表了海生館在海洋生態保育的軌跡及海洋教育發展的歷程，並專區介紹臺灣周邊海域(墾丁、綠島、蘭嶼)的優質潛點，搭配展出水下攝影器材及潛水裝備，藉以宣導安全潛水。<br></p>', '2020-10-24 13:24:10', '2020-10-24 13:24:10'),
	(5, 5, '我們開幕囉!', '台灣獨創「Xpark x UNIQLO T恤入場券」歡慶Xpark開幕！', '2020-10-10', '/upload/events_ch/160354596942a0e188f5033bc65bf8d78622277c4e.jpg', '<p>&nbsp;Xpark x UNIQLO桃園指定店舖滿額贈紀念T恤（含門票）活動。Xpark與UNIQLO共同開發獨創「Xpark x UNIQLO T恤入場券 (T-Shirt Ticket)」。大人、小孩款為不同的Xpark獨創圖案設計，並於T恤上印有Xpark入場券QRCODE。顧客於UNIQLO指定店鋪，購買3,000元以上商品(需包含大人小孩商品)，即可獲得乙件。穿著/持有「Xpark x UNIQLO T恤入場券 (T-Shirt Ticket)」，即可入場Xpark。<br></p>', '2020-10-24 13:26:09', '2020-10-24 13:26:09');
/*!40000 ALTER TABLE `ch_events` ENABLE KEYS */;

-- 傾印  資料表 xpark_db.ch_news 結構
CREATE TABLE IF NOT EXISTS `ch_news` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sort` int(11) NOT NULL DEFAULT 1,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 正在傾印表格  xpark_db.ch_news 的資料：~4 rows (近似值)
/*!40000 ALTER TABLE `ch_news` DISABLE KEYS */;
INSERT INTO `ch_news` (`id`, `sort`, `title`, `date`, `image`, `info`, `created_at`, `updated_at`) VALUES
	(1, 4, '小企鵝平安誕生惹~', '2020-09-02', '/upload/news_ch/1603536404fc221309746013ac554571fbd180e1c8.jpg', '企鵝仙女乾媽們說，非常驚喜也感到很意外，蒲公英(母)跟三葉草(父)誕下新生命，小企鵝於2020年6月22日出生，體重100公克，出生兩個月之後體重已經到了3.65公斤。\r\n\r\n據乾媽的觀察表示，小企鵝應該是男生，也是一個非常有膽量的好奇寶寶，第一天下水隔天就跑到對面的水域去玩耍，父母親目前都還未真的到對面去，做到了連成年企鵝都很難做到的事情。', '2020-10-24 10:46:44', '2020-10-24 10:46:44'),
	(2, 3, '新冠肺炎疫情因應措施', '2020-09-15', '/upload/news_ch/16035366776974ce5ac660610b44d9b9fed0ff9548.jpg', '<p>體溫測量</p><p>實施紅外線體溫量測儀進行體溫監測。若體溫過高則使用非接觸式體溫計重測，若高於攝氏37.5度則得拒絕入館。</p><p>消毒對策</p><p>遊客入館前需消毒手部並配戴口罩，觸摸頻率高的地方(如樓梯、電扶梯的扶手、電梯按鈕、化粧室等)每2小時消毒清潔一次。入口處及館內複數重點處會設置消毒液提供遊客使用。(如電梯前、各樓層化粧室、館內Cafe、紀念品店、哺乳室、救護中心等)</p>', '2020-10-24 10:51:17', '2020-10-24 12:46:58'),
	(3, 2, '對於本館生物照護疑慮之聲明', '2020-10-15', '/upload/news_ch/16035369731d7f7abc18fcb43975065399b0d1e48e.jpg', '<p>Xpark未來會強化在社群媒體及現場活動上的教育傳播功能，避免有心人士於其他管道營造本館漠視動物權利之錯誤印象。</p><p>針對各類不實指控，如發生傷及我方商譽行為，本館將採取法律途徑以維護自身權益。\r\n\r\n最後，再次感謝所有喜歡動物的每一位民眾對生物們的關心，各位的意見Xpark都不會漠視，Xpark的建立目標，承襲株式會社橫浜八景島的經營理念─透過生物散播笑容與感動到全世界，同時也期望可以透過水族館建立起親近海洋的管道。</p>', '2020-10-24 10:56:13', '2020-10-24 12:48:29'),
	(4, 1, '購票請先至KKday網站預購', '2020-10-18', '/upload/news_ch/1603537053149e9677a5989fd342ae44213df68868.jpg', '<p>Xpark為台灣首座新都會型水生公園。將生活在地球上各種地域的生物們的環境，透過空間演出與科技的融合，加以忠實的重現。在連氣溫、濕度、味道及聲音都經過縝密計算的空間裡，從天花板到地坪、延伸至水槽的影像演出呈現出360°具魄力的沉浸式空間。</p><p>來訪的遊客並非單純透過壓克力玻璃觀賞生物，而是彷彿真的身歷其境，可以使用五感體驗各真實場景。隨環境變遷而演變進化的生物們的不思議，從全方位各種角度將其魅力性襯托出來的環境演出也是一大特徵。</p>', '2020-10-24 10:57:33', '2020-10-24 12:47:52');
/*!40000 ALTER TABLE `ch_news` ENABLE KEYS */;

-- 傾印  資料表 xpark_db.en_events 結構
CREATE TABLE IF NOT EXISTS `en_events` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sort` int(11) NOT NULL DEFAULT 1,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 正在傾印表格  xpark_db.en_events 的資料：~0 rows (近似值)
/*!40000 ALTER TABLE `en_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `en_events` ENABLE KEYS */;

-- 傾印  資料表 xpark_db.en_news 結構
CREATE TABLE IF NOT EXISTS `en_news` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sort` int(11) NOT NULL DEFAULT 1,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 正在傾印表格  xpark_db.en_news 的資料：~0 rows (近似值)
/*!40000 ALTER TABLE `en_news` DISABLE KEYS */;
/*!40000 ALTER TABLE `en_news` ENABLE KEYS */;

-- 傾印  資料表 xpark_db.failed_jobs 結構
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 正在傾印表格  xpark_db.failed_jobs 的資料：~0 rows (近似值)
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;

-- 傾印  資料表 xpark_db.migrations 結構
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 正在傾印表格  xpark_db.migrations 的資料：~7 rows (近似值)
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '2014_10_12_000000_create_users_table', 1),
	(2, '2014_10_12_100000_create_password_resets_table', 1),
	(3, '2019_08_19_000000_create_failed_jobs_table', 1),
	(4, '2020_10_23_034342_create_ch_news_table', 2),
	(5, '2020_10_23_035154_create_en_news_table', 3),
	(6, '2020_10_23_035307_create_ch_events_table', 4),
	(7, '2020_10_23_035414_create_en_events_table', 5);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;

-- 傾印  資料表 xpark_db.password_resets 結構
CREATE TABLE IF NOT EXISTS `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 正在傾印表格  xpark_db.password_resets 的資料：~0 rows (近似值)
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;

-- 傾印  資料表 xpark_db.users 結構
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 正在傾印表格  xpark_db.users 的資料：~0 rows (近似值)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
	(1, 'xpark', 'xpark@gmail.com', NULL, '$2y$10$3rgK6JdQ.wXSGc/9c1Dc3ezeXeReR8JejQSxDpXklQ0FdaeaOfo0.', 'wbUjzNG0CgpGo6ljC2SdtovyRwZ595c1Pnc1QST7v1OHhWWck1DWdCE2ZtnM', '2020-10-22 02:28:30', '2020-10-22 02:28:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
