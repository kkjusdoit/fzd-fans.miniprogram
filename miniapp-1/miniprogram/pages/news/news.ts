import { news, categories } from '../../data/news';

interface NewsItem {
  date: string;
  category: string;
  categoryLabel: string;
  categoryIcon: string;
  categoryColor: string;
  title: string;
  summary: string;
  image: string;
  source: string;
}

Page({
  data: {
    categories: categories as any[],
    allNews: news as NewsItem[],
    visibleNews: [] as NewsItem[],
    activeCat: 'all'
  },

  onLoad() {
    this.applyFilter('all');
  },

  onFilterTap(e: any) {
    const cat = e.currentTarget.dataset.cat as string;
    this.applyFilter(cat);
  },

  applyFilter(cat: string) {
    const all = this.data.allNews;
    const visible = cat === 'all' ? all : all.filter((n) => n.category === cat);
    this.setData({ activeCat: cat, visibleNews: visible });
  },

  onPreviewImage(e: any) {
    const src = e.currentTarget.dataset.src as string;
    if (!src) return;
    const urls = this.data.visibleNews.map((n) => n.image).filter(Boolean);
    wx.previewImage({ current: src, urls });
  },

  onShareAppMessage() {
    return {
      title: '樊振东快讯 · 樊振东的互联网档案馆',
      path: '/pages/news/news'
    };
  },
  onShareTimeline() {
    return { title: '樊振东快讯 · 樊振东的互联网档案馆' };
  }
});
