import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Moon,
  Sun,
  Heart,
  User,
  ChevronRight,
  RefreshCw,
  ArrowUpDown,
  Home,
  FileText,
  ShoppingBag,
  Percent,
  Flame,
  Plus,
  Minus,
} from 'lucide-react';
import { SHOP, CATEGORIES, PRODUCTS } from './products';
import './index.css';

const tg = window.Telegram?.WebApp;
const money = (n) => '$' + n.toFixed(2);
const load = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
};
const save = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

const SLIDES = [
  {
    title: 'បញ្ចុះតម្លៃ 5% ភ្លាមៗ (GET 5% OFF)',
    sub: 'បញ្ចុះតម្លៃ 5% សម្រាប់ការទិញចាប់ពី $100 ឡើងទៅ (5% OFF on orders over $100)',
    from: '$100.00',
  },
  {
    title: 'ដឹកជញ្ជូនរហ័ស (FAST DELIVERY)',
    sub: 'កម្ម៉ង់ថ្ងៃនេះ ទទួលបានលឿន (Order today, get it fast)',
    from: '$20.00',
  },
];

export default function App() {
  const [tab, setTab] = useState('home');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('none');
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState(null); // null = closed
  const [slide, setSlide] = useState(0);
  const [cart, setCart] = useState({});
  const [favs, setFavs] = useState(() => load('favs', []));
  const [orders, setOrders] = useState(() => load('orders', []));
  const [sending, setSending] = useState(false);

  useEffect(() => {
    tg?.ready();
    tg?.expand();
  }, []);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const shown = useMemo(() => {
    let l = PRODUCTS.filter((p) => cat === 'All' || p.cat === cat);
    if (search)
      l = l.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'asc') l = [...l].sort((a, b) => a.price - b.price);
    if (sort === 'desc') l = [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [cat, sort, search]);

  const items = PRODUCTS.filter((p) => cart[p.id]).map((p) => ({
    ...p,
    qty: cart[p.id],
  }));
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const discount = subtotal >= 100 ? subtotal * 0.05 : 0;
  const total = subtotal - discount;

  const change = (id, d) =>
    setCart((c) => {
      const q = (c[id] || 0) + d,
        n = { ...c };
      q <= 0 ? delete n[id] : (n[id] = q);
      return n;
    });
  const toggleFav = (id) =>
    setFavs((f) => {
      const n = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
      save('favs', n);
      return n;
    });
  const cycleSort = () =>
    setSort((s) => (s === 'none' ? 'asc' : s === 'asc' ? 'desc' : 'none'));
  const refresh = () => {
    setCat('All');
    setSort('none');
    setSearch(null);
  };
  const notify = (m) => (tg ? tg.showAlert(m) : alert(m));

  async function checkout() {
    if (!items.length || sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData: tg?.initData || '',
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            qty: i.qty,
            price: i.price,
          })),
          total,
        }),
      });
      if (!res.ok) throw new Error();
      const o = [
        { date: new Date().toLocaleString(), items, total },
        ...orders,
      ];
      setOrders(o);
      save('orders', o);
      setCart({});
      setTab('orders');
      notify('Order sent! We will contact you soon.');
    } catch {
      notify('Could not send the order. Please try again.');
    }
    setSending(false);
  }

  const s = SLIDES[slide];

  return (
    <div className={'app' + (dark ? ' dark' : '')}>
      <div className="page">
        <header>
          <div className="shopchip">
            <div className="avatar">
              {SHOP.logo ? <img src={SHOP.logo} alt="" /> : SHOP.name[0]}
            </div>
            [9/30/2026 12:58 PM] Rithya 🌷 Momenta Handmade:{' '}
            <div className="who">
              <b>{SHOP.name}</b>
              <small>{SHOP.handle}</small>
            </div>
          </div>
          <div className="icons">
            <button onClick={() => setSearch(search === null ? '' : null)}>
              <Search size={22} />
            </button>
            <button onClick={() => setDark(!dark)}>
              {dark ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button onClick={() => setTab('favs')}>
              <Heart size={22} />
            </button>
            <button>
              <User size={22} />
            </button>
          </div>
        </header>
        {search !== null && (
          <input
            className="search"
            autoFocus
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
        {tab === 'home' && (
          <>
            <section className="banner">
              <div className="pct">
                <Percent size={18} />
              </div>
              <h2>{s.title}</h2>
              <p>{s.sub}</p>
              <div className="bfoot">
                <span>
                  ទិញចាប់ពី <b>{s.from}</b> ឡើងទៅ
                </span>
                <button
                  className="shopnow"
                  onClick={() =>
                    document
                      .getElementById('list')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  <ShoppingBag size={16} /> Shop Now
                </button>
              </div>
              <div className="dots">
                {SLIDES.map((_, i) => (
                  <i key={i} className={i === slide ? 'on' : ''} />
                ))}
              </div>
            </section>

            <nav className="cats">
              {['All', ...CATEGORIES].map((c) => (
                <button
                  key={c}
                  className={c === cat ? 'on' : ''}
                  onClick={() => setCat(c)}
                >
                  {c}
                </button>
              ))}
            </nav>

            <div className="titlebar" id="list">
              <h2>
                ផលិតផលទំនិញ <span className="pill">{shown.length} items</span>
              </h2>
              <div className="actions">
                <button onClick={refresh}>
                  <RefreshCw size={16} /> Refresh
                </button>
                <button onClick={cycleSort}>
                  <ArrowUpDown size={16} /> Sort
                  {sort !== 'none' && (sort === 'asc' ? ' ↑' : ' ↓')}
                </button>
              </div>
            </div>
          </>
        )}
        {(tab === 'home' || tab === 'favs') && (
          <main className="grid">
            {(tab === 'favs'
              ? shown.filter((p) => favs.includes(p.id))
              : shown
            ).map((p) => (
              <article key={p.id} className={'card' + (p.was ? ' sale' : '')}>
                <div className="img">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" />
                  ) : (
                    <span>{p.name[0]}</span>
                  )}
                  {p.popular && <em className="badge pop">POPULAR</em>}
                  {p.was && (
                    <em className="badge off">
                      <Flame size={12} /> -
                      {Math.round((1 - p.price / p.was) * 100)}%
                    </em>
                  )}
                  <button
                    className={'heart' + (favs.includes(p.id) ? ' on' : '')}
                    onClick={() => toggleFav(p.id)}
                  >
                    <Heart size={18} />
                  </button>
                </div>
                <h3>{p.name}</h3>
                <p className="desc">High quality product</p>
                <div className="sizes">
                  {p.sizes.slice(0, 4).map((z) => (
                    <span key={z}>{z}</span>
                  ))}
                  {p.sizes.length > 4 && <small>+{p.sizes.length - 4}</small>}
                </div>
                <div className="row">
                  <div className="price">
                    <span className={p.was ? 'red' : ''}>{money(p.price)}</span>
                    {p.was && <s>{money(p.was)}</s>}
                  </div>
                  {cart[p.id] ? (
                    <div className="qty">
                      <button onClick={() => change(p.id, -1)}>
                        <Minus size={14} />
                      </button>
                      <b>{cart[p.id]}</b>
                      <button onClick={() => change(p.id, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button className="go" onClick={() => change(p.id, 1)}>
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </main>
        )}
        [9/30/2026 12:58 PM] Rithya 🌷 Momenta Handmade:{' '}
        {tab === 'cart' && (
          <section className="panel">
            <h2>កន្ត្រកទំនិញ</h2>
            {items.length === 0 && (
              <p className="empty">
                Your cart is empty. Add a product to start.
              </p>
            )}
            {items.map((i) => (
              <div className="line" key={i.id}>
                <span>{i.name}</span>
                <div className="qty">
                  <button onClick={() => change(i.id, -1)}>
                    <Minus size={14} />
                  </button>
                  <b>{i.qty}</b>
                  <button onClick={() => change(i.id, 1)}>
                    <Plus size={14} />
                  </button>
                </div>
                <b>{money(i.qty * i.price)}</b>
              </div>
            ))}
            {discount > 0 && (
              <div className="line">
                <span>Discount 5%</span>
                <b>-{money(discount)}</b>
              </div>
            )}
            <div className="line total">
              <span>Total</span>
              <b>{money(total)}</b>
            </div>
            <button
              className="place"
              disabled={!items.length || sending}
              onClick={checkout}
            >
              {sending ? 'Sending…' : 'Place order'}
            </button>
          </section>
        )}
        {tab === 'orders' && (
          <section className="panel">
            <h2>ប្រវត្តិកម្ម៉ង់ទិញ</h2>
            {orders.length === 0 && (
              <p className="empty">
                No orders yet. Your placed orders will show here.
              </p>
            )}
            {orders.map((o, k) => (
              <div className="order" key={k}>
                <small>{o.date}</small>
                {o.items.map((i) => (
                  <div key={i.id}>
                    {i.name} × {i.qty}
                  </div>
                ))}
                <b>{money(o.total)}</b>
              </div>
            ))}
          </section>
        )}
      </div>

      <nav className="bottom">
        <button
          className={tab === 'home' || tab === 'favs' ? 'on' : ''}
          onClick={() => setTab('home')}
        >
          <Home size={24} />
          <span>ទំព័រដើម</span>
        </button>
        <button
          className={tab === 'orders' ? 'on' : ''}
          onClick={() => setTab('orders')}
        >
          <FileText size={24} />
          <span>ប្រវត្តិកម្ម៉ង់ទិញ</span>
        </button>
        <button
          className={tab === 'cart' ? 'on' : ''}
          onClick={() => setTab('cart')}
        >
          <ShoppingBag size={24} />
          {count > 0 && <em className="cnt">{count}</em>}
          <span>កន្ត្រកទំនិញ</span>
        </button>
      </nav>
    </div>
  );
}
