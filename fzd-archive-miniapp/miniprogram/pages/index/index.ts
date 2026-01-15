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
    categories: [] as any[]
  },
  lifetimes: {
    attached() {
      const cats = new Set(content.map((c: any) => c.category));
      const categories = Array.from(cats).map(c => ({
        id: c,
        name: CATEGORY_MAP[c] || c,
        count: content.filter((item: any) => item.category === c).length
      }));
      this.setData({ categories });
    }
  },
  methods: {
    onCategoryTap(e: any) {
      const category = e.currentTarget.dataset.category;
      wx.navigateTo({
        url: `../category/category?id=${category}`
      });
    }
  }
})
