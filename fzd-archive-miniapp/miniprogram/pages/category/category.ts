import { content } from '../../data/content';

const CATEGORY_MAP: Record<string, string> = {
  fzd101: '樊振东101',
  stars: '樊星',
  tributes: '致敬',
  warrior: '战士',
  quotes: '语录',
  links: '链接',
  ugc: '投稿',
  friends: '朋友',
  arena: '赛场'
};

Component({
  data: {
    articles: [] as any[],
    categoryName: ''
  },
  methods: {
    onLoad(options: any) {
      const categoryId = options.id;
      const filtered = content.filter((item: any) => item.category === categoryId);
      const name = CATEGORY_MAP[categoryId] || categoryId;
      
      this.setData({
        articles: filtered,
        categoryName: name
      });
      
      wx.setNavigationBarTitle({
        title: name
      });
    },
    onArticleTap(e: any) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `../article/article?id=${id}`
      });
    }
  }
})
