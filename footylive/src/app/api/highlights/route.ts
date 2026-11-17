import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'ALL';

  try {
    // Fetch live soccer news & video clips from public ESPN soccer feed
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/all/news', {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: 'ESPN media feed unavailable', highlights: [] },
        { status: 502 }
      );
    }

    const data = await res.json();
    const articles = data.articles || [];

    const highlights = articles.map((article: any, idx: number) => {
      const video = article.video?.[0] || article.videos?.[0];
      const thumbnailUrl = article.images?.[0]?.url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80';
      const duration = video?.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '04:15';
      const tag = idx % 3 === 0 ? 'ALL GOALS' : idx % 2 === 0 ? 'EXTENDED' : 'VIRAL';

      return {
        id: `h-live-${article.id || idx}`,
        title: article.headline || 'Match Highlights & Analysis',
        match: article.description?.slice(0, 50) || 'Global Football Fixture',
        tournament: article.categories?.[0]?.description || 'International Soccer',
        duration,
        thumbnailUrl,
        views: `${(Math.random() * 2 + 0.5).toFixed(1)}M`,
        date: article.published ? new Date(article.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today',
        quality: '4K HDR',
        tag,
      };
    });

    const filtered = filter === 'ALL' ? highlights : highlights.filter((h: any) => h.tag === filter);

    return NextResponse.json({
      success: true,
      highlights: filtered,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch highlights', highlights: [] },
      { status: 503 }
    );
  }
}
