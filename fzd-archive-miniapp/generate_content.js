const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const CONTENT_DIR = '/Users/linkunkun/fzd-fans.com/fzd-archive/src/content';
const OUTPUT_JS = path.join(__dirname, 'miniprogram/data/content.js');
const OUTPUT_D_TS = path.join(__dirname, 'miniprogram/data/content.d.ts');

const categories = fs.readdirSync(CONTENT_DIR).filter(file => {
    return fs.statSync(path.join(CONTENT_DIR, file)).isDirectory();
});

const allContent = [];

// Custom renderer to fix image paths
const renderer = new marked.Renderer();
const originalImage = renderer.image.bind(renderer);

renderer.image = ({ href, title, text }) => {
    if (href && href.startsWith('/') && !href.startsWith('/images/')) {
        href = '/images' + href;
    }
    return originalImage({ href, title, text });
};

marked.use({ renderer });

function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return { frontmatter: {}, body: content };

    const frontmatterRaw = match[1];
    const body = content.slice(match[0].length).trim();
    const frontmatter = {};

    frontmatterRaw.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;
        
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();

        // Handle string quotes
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }
        
        // Handle arrays (simple version)
        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map(s => {
                s = s.trim();
                if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1);
                return s;
            });
        }
        
        // Handle booleans
        if (value === 'true') value = true;
        if (value === 'false') value = false;

        frontmatter[key] = value;
    });

    return { frontmatter, body };
}

categories.forEach(category => {
    const categoryPath = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryPath)) return; 

    const langs = fs.readdirSync(categoryPath).filter(file => {
        return fs.statSync(path.join(categoryPath, file)).isDirectory();
    });

    langs.forEach(lang => {
        const langPath = path.join(categoryPath, lang);
        const files = fs.readdirSync(langPath).filter(file => file.endsWith('.md'));

        files.forEach(file => {
            const filePath = path.join(langPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const { frontmatter, body } = parseFrontmatter(content);

            allContent.push({
                id: `${category}-${lang}-${path.basename(file, '.md')}`,
                category,
                lang,
                filename: file,
                ...frontmatter,
                body: marked.parse(body) // Use marked to convert
            });
        });
    });
});

// Manual content for Arena (Career)
allContent.push({
    id: 'arena-zh-report',
    category: 'arena',
    lang: 'zh',
    title: '樊振东职业生涯分析报告',
    description: '从无可超越到新的征程',
    body: marked.parse(`
## 从无可超越到新的征程

纵览樊振东的职业生涯，从他创下的无可超越的历史记录，到那些定义时代的重要赛场时刻，再到引发热议的退出世界排名与出走德甲。通过交互式数据与时间轴，一览这位乒坛巨星的轨迹。

### 历史丰碑

- **世界排名榜首**：连续多年统治力
- **世界杯冠军**：4次（历史记录）
- **九大赛单打**：全满贯成就解锁
- **德甲新征程**：2025赛季启动

### 数据洞察

数据显示，樊振东在2018-2023年间保持了极高的胜率，尤其是在世界杯赛场上，创造了近乎"无可超越"的记录。他的打法结合了极高的单板质量与细腻的台内控制，是现代乒乓球技术的集大成者。
`)
});

allContent.push({
    id: 'arena-en-report',
    category: 'arena',
    lang: 'en',
    title: 'Fan Zhendong Analysis',
    description: 'Career & Transition Report',
    body: marked.parse(`
## Career & Transition Report

Overview of Fan Zhendong's career, from the historical records he set, to the defining moments of the era, to the heated discussions about his withdrawal from world rankings and his move to the Bundesliga.

### Historical Monuments

- **World No.1**: Dominance for years
- **World Cup Titles**: 4 Times (Historical Record)
- **Grand Slam**: Major Singles Titles Unlocked
- **Bundesliga Journey**: 2025 Season Start

### Data Insights

Data shows that Fan Zhendong maintained an extremely high winning rate between 2018 and 2023, especially in the World Cup, creating records that are almost "unsurpassable". His playing style combines high quality shots with delicate control, representing the pinnacle of modern table tennis techniques.
`)
});

// Manual content for Porsche Letters
allContent.push({
    id: 'stars-zh-porsche-letters',
    category: 'stars',
    lang: 'zh',
    title: '保时捷家书',
    description: '樊振东与球迷的理性沟通，运动员对抗饭圈化的典范',
    body: marked.parse(`
## 一、家书的由来

樊振东早先有段时间未注册个人社交账号，自2021年起通过球迷会微博（华为Mate40保时捷设计手机发布）与球迷沟通。因发布设备含"保时捷"字样，四封长信被球迷亲切地称为**"保时捷家书"**。

## 二、核心主张

### 🚫 拒绝饭圈化
明确反对集资应援、投票打榜、接送机、追拍私生活等行为，强调运动员与球迷的关系仅限于赛场。

### 🏠 维护个人空间
除队伍公开行程外，个人行程谢绝接触；仅收取手写信件，拒收礼物以避免粉丝经济消耗。

### 💡 呼吁理性支持
主张球迷专注自身生活，仅通过赛场表现见证运动员成长，抵制对私生活的窥探或网络骂战。

## 📜 家书原文

![保时捷家书 1](/images/stars/letters/1.jpg)
![保时捷家书 2](/images/stars/letters/2.jpg)
![保时捷家书 3](/images/stars/letters/3.jpg)
![保时捷家书 4](/images/stars/letters/4.jpg)
![保时捷家书 5](/images/stars/letters/5.jpg)
![保时捷家书 6](/images/stars/letters/6.jpg)
`)
});

// Deduplicate content by ID (last one wins)
const uniqueContent = Array.from(new Map(allContent.map(item => [item.id, item])).values());

// Generate CommonJS .js file
const jsContent = `module.exports = {
  content: ${JSON.stringify(uniqueContent, null, 2)}
};`;

fs.writeFileSync(OUTPUT_JS, jsContent);

// Generate .d.ts file for TypeScript support
const dtsContent = `export declare const content: any[];`;

fs.writeFileSync(OUTPUT_D_TS, dtsContent);

console.log(`Generated content for ${allContent.length} items (JS + Type Definition).`);
