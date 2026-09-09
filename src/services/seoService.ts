import { Article } from '../types';

export interface GoogleSEOSettings {
  googleSiteVerification: string;
  googleAnalyticsId: string;
  adsensePublisherId: string;
  adsenseAutoAds: boolean;
  canonicalDomain: string;
  enableNewsArticleSchema: boolean;
  enableSearchSitelinks: boolean;
  robotsAllowAll: boolean;
}

const SEO_STORAGE_KEY = 'press_express_assam_google_seo_settings_v1';

export const DEFAULT_GOOGLE_SEO_SETTINGS: GoogleSEOSettings = {
  googleSiteVerification: 'dFVjUOSogERIju8vMlkfhQmaUidHzXvV6IKdHZ1gS9s',
  googleAnalyticsId: 'G-PEA2026ASSAM',
  adsensePublisherId: 'ca-pub-7894210984123567',
  adsenseAutoAds: true,
  canonicalDomain: 'https://pressexpressassam.in',
  enableNewsArticleSchema: true,
  enableSearchSitelinks: true,
  robotsAllowAll: true,
};

class SEOService {
  private settings: GoogleSEOSettings;

  constructor() {
    this.settings = this.loadSettings();
    if (typeof window !== 'undefined') {
      this.applyGoogleVerification();
      this.applyGoogleAdSenseScript();
      this.injectDefaultStructuredData();
    }
  }

  public getSettings(): GoogleSEOSettings {
    return { ...this.settings };
  }

  public saveSettings(newSettings: Partial<GoogleSEOSettings>): GoogleSEOSettings {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // Fallback
    }

    this.applyGoogleVerification();
    this.applyGoogleAdSenseScript();
    return { ...this.settings };
  }

  private loadSettings(): GoogleSEOSettings {
    if (typeof window === 'undefined') return DEFAULT_GOOGLE_SEO_SETTINGS;
    try {
      const stored = localStorage.getItem(SEO_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_GOOGLE_SEO_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_GOOGLE_SEO_SETTINGS;
  }

  /**
   * Applies Google Search Console verification meta tag to the document head
   */
  public applyGoogleVerification() {
    if (typeof document === 'undefined') return;

    let meta = document.querySelector('meta[name="google-site-verification"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'google-site-verification';
      document.head.appendChild(meta);
    }
    meta.content = this.settings.googleSiteVerification || 'GSC-press-express-assam-verify-2026';
  }

  /**
   * Loads Google AdSense official script tag if publisher ID is configured
   */
  public applyGoogleAdSenseScript() {
    if (typeof document === 'undefined') return;
    const pubId = this.settings.adsensePublisherId?.trim();
    if (!pubId || !this.settings.adsenseAutoAds) return;

    const scriptId = 'google-adsense-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const expectedSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = expectedSrc;
      document.head.appendChild(script);
    } else if (script.src !== expectedSrc) {
      script.src = expectedSrc;
    }
  }

  /**
   * Injects default Google News Organization and WebSite Schema.org JSON-LD
   */
  public injectDefaultStructuredData() {
    if (typeof document === 'undefined') return;

    const scriptId = 'schema-org-organization';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }

    const domain = this.settings.canonicalDomain || 'https://pressexpressassam.in';

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'NewsMediaOrganization',
          '@id': `${domain}/#organization`,
          name: 'Press Express Assam',
          alternateName: 'প্ৰেছ এক্সপ্ৰেছ অসম',
          url: domain,
          logo: {
            '@type': 'ImageObject',
            url: `${domain}/press_express_logo.jpg`,
            width: 512,
            height: 512,
          },
          publishingPrinciples: `${domain}/about#ethics`,
          correctionsPolicy: `${domain}/about#corrections`,
          ethicsPolicy: `${domain}/about#ethics`,
          sameAs: [
            'https://facebook.com/PressExpressAssam',
            'https://twitter.com/PressExpressAssam',
            'https://instagram.com/PressExpressAssam',
            'https://youtube.com/@PressExpressAssam',
          ],
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Guwahati',
            addressRegion: 'Assam',
            addressCountry: 'IN',
          },
        },
        {
          '@type': 'WebSite',
          '@id': `${domain}/#website`,
          url: domain,
          name: 'Press Express Assam',
          alternateName: 'অসমৰ ডিজিটেল সংবাদ মাধ্যম',
          publisher: {
            '@id': `${domain}/#organization`,
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${domain}/?search={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
          inLanguage: ['as', 'en'],
        },
      ],
    };

    script.textContent = JSON.stringify(schema, null, 2);
  }

  /**
   * Dynamically updates page SEO metadata & Schema.org NewsArticle when reading an article
   */
  public updateArticleSEO(article: Article) {
    if (typeof document === 'undefined') return;

    const domain = this.settings.canonicalDomain || 'https://pressexpressassam.in';
    const articleUrl = `${domain}/?article=${article.id}`;
    const fullTitle = article.titleAssamese
      ? `${article.titleAssamese} | ${article.title} - Press Express Assam`
      : `${article.title} - Press Express Assam`;

    // 1. Update Title & Meta Description
    document.title = fullTitle;

    this.setMeta('description', article.summary);
    this.setMeta('keywords', `${article.category}, ${article.district}, Assam News, অসমৰ বাতৰি, ${article.tags.join(', ')}`);
    this.setMeta('author', article.author);

    // 2. Open Graph & Twitter Cards
    this.setMeta('og:title', article.titleAssamese || article.title, 'property');
    this.setMeta('og:description', article.summary, 'property');
    this.setMeta('og:image', article.imageUrl, 'property');
    this.setMeta('og:url', articleUrl, 'property');
    this.setMeta('og:type', 'article', 'property');

    this.setMeta('twitter:title', article.titleAssamese || article.title);
    this.setMeta('twitter:description', article.summary);
    this.setMeta('twitter:image', article.imageUrl);

    // 3. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = articleUrl;

    // 4. Inject Google NewsArticle Schema.org JSON-LD
    const articleScriptId = 'schema-org-news-article';
    let articleScript = document.getElementById(articleScriptId);
    if (!articleScript) {
      articleScript = document.createElement('script');
      articleScript.id = articleScriptId;
      articleScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(articleScript);
    }

    const newsArticleSchema = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl,
      },
      headline: article.titleAssamese || article.title,
      alternativeHeadline: article.title,
      image: [article.imageUrl],
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      author: {
        '@type': 'Person',
        name: article.author,
        jobTitle: 'Journalist / Special Correspondent',
      },
      publisher: {
        '@type': 'NewsMediaOrganization',
        name: 'Press Express Assam',
        logo: {
          '@type': 'ImageObject',
          url: `${domain}/press_express_logo.jpg`,
        },
      },
      description: article.summary,
      articleBody: article.content.join(' '),
      articleSection: article.category,
      contentLocation: {
        '@type': 'Place',
        name: `${article.district}, Assam, India`,
      },
      inLanguage: 'as',
      isAccessibleForFree: true,
    };

    articleScript.textContent = JSON.stringify(newsArticleSchema, null, 2);
  }

  /**
   * Resets page metadata back to homepage state
   */
  public resetToHomepageSEO() {
    if (typeof document === 'undefined') return;

    document.title = 'Press Express Assam - অসমৰ ক্ষিপ্ৰ আৰু বিশ্বাসযোগ্য ডিজিটেল সংবাদ মাধ্যম';
    this.setMeta('description', 'Real-time news portal for Assam with live video streaming, breaking alerts, offline reading mode, personalized feeds, cloud sync, MFA authentication, and privacy controls.');

    // Remove article schema if present
    const articleScript = document.getElementById('schema-org-news-article');
    if (articleScript) {
      articleScript.remove();
    }

    // Reset canonical
    const domain = this.settings.canonicalDomain || 'https://pressexpressassam.in';
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = domain;
    }
  }

  private setMeta(name: string, content: string, attributeName: 'name' | 'property' = 'name') {
    let el = document.querySelector(`meta[${attributeName}="${name}"]`) as HTMLMetaElement;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attributeName, name);
      document.head.appendChild(el);
    }
    el.content = content;
  }
}

export const seoService = new SEOService();
