'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { getProducts, placeOrder, Product, Order } from '@/lib/db';
import { ShoppingBag, X, Check, HelpCircle, ArrowRight, Sparkles, MessageSquare, AlertCircle, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StorePage() {
  const { user, setShowAuthModal } = useApp();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Selected product details lightbox
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [orderQty, setOrderQty] = useState<number>(1);

  // Checkout Modal states
  const [showCheckout, setShowCheckout] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  
  // Success order placement details
  const [orderSuccessId, setOrderSuccessId] = useState('');

  const categories = ['All', 'Baju', 'Jaket', 'Topi', 'Celana'];

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    };
    loadProducts();
  }, []);

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  // Sync buyer name when user loaded
  useEffect(() => {
    if (user.isLoggedIn) {
      setBuyerName(user.fullName);
    }
  }, [user]);

  // Format Price IDR
  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Open Checkout (Includes Gating checks)
  const handleOpenCheckout = () => {
    if (!user.isLoggedIn) {
      // Close details modal
      setSelectedProduct(null);
      // Trigger login modal
      setShowAuthModal(true);
      return;
    }

    if (selectedProduct && selectedProduct.sizes.length > 0 && !selectedSize) {
      alert('Pilih ukuran (size) terlebih dahulu!');
      return;
    }

    setShowCheckout(true);
  };

  // Confirm Purchase & Open WhatsApp
  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !buyerName || !buyerPhone || !buyerAddress) return;
    setCheckoutError('');

    const totalPrice = selectedProduct.price * orderQty;

    setSubmittingOrder(true);
    const orderId = await placeOrder({
      product_id: selectedProduct.id,
      buyer_name: buyerName,
      buyer_email: user.email,
      buyer_phone: buyerPhone,
      buyer_address: buyerAddress,
      quantity: orderQty,
      size: selectedSize || 'All Size',
      total_price: totalPrice
    });
    setSubmittingOrder(false);

    if (orderId) {
      setOrderSuccessId(orderId);
      
      // WhatsApp redirect link compile
      const waNumber = '628123456789'; // Immortal Division store WA
      const waText = `Halo Immortal Division Store, saya ingin konfirmasi pembayaran untuk pesanan merchandise berikut:

Order ID: ${orderId}
Nama: ${buyerName}
Barang: ${selectedProduct.name} (Size: ${selectedSize || 'All Size'})
Jumlah: ${orderQty}
Total Transfer: ${formatIDR(totalPrice)}
Alamat Pengiriman: ${buyerAddress}

Saya telah melakukan transfer ke rekening BCA. Berikut saya kirimkan juga bukti transfernya. Terima kasih!`;

      const encodedText = encodeURIComponent(waText);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;
      
      // Open WA in a new tab
      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
      }
    } else {
      setCheckoutError('Terjadi kesalahan saat memproses order.');
    }
  };

  const closeCheckoutFlow = () => {
    setSelectedProduct(null);
    setSelectedSize('');
    setOrderQty(1);
    setShowCheckout(false);
    setBuyerPhone('');
    setBuyerAddress('');
    setOrderSuccessId('');
  };

  return (
    <div className="bg-grid min-h-screen pt-12 pb-24">
      {/* Glow Spheres */}
      <div className="pointer-events-none absolute top-0 left-1/3 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary"
          >
            <ShoppingBag size={12} fill="currentColor" />
            <span>Official Merch Shop</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl"
          >
            IMMORTAL <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-stroke-red text-transparent">STORE</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted md:mx-0"
          >
            Miliki merchandise eksklusif Immortal Division—kaos oversized, jaket windbreaker, topi, kargo celana, dan aksesoris audio premium lainnya.
          </motion.p>
        </div>

        {/* Categories Tabs Panel */}
        <div className="mb-10 flex border-b border-white/5 pb-4">
          <div className="flex gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative pb-4 text-xs font-bold uppercase tracking-wider transition ${
                  selectedCategory === cat ? 'text-primary' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>{cat === 'All' ? 'Semua Produk' : cat}</span>
                {selectedCategory === cat && (
                  <motion.span
                    layoutId="activeStoreFilterBorder"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((prod, idx) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => {
                setSelectedProduct(prod);
                if (prod.sizes.length > 0) {
                  setSelectedSize(prod.sizes[0]);
                }
              }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-[#08080a] p-3 transition duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-900">
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-103"
                />
                
                {/* Category tag */}
                <span className="absolute top-3 left-3 rounded bg-black/80 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-primary border border-primary/20 backdrop-blur-sm">
                  {prod.category}
                </span>

                {/* Stock Warning */}
                {prod.stock <= 5 && prod.stock > 0 && (
                  <span className="absolute top-3 right-3 rounded bg-amber-600 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                    Sisa {prod.stock}
                  </span>
                )}
                {prod.stock === 0 && (
                  <span className="absolute inset-0 bg-black/75 flex items-center justify-center text-xs font-black uppercase text-rose-500 tracking-wider">
                    SOLD OUT
                  </span>
                )}
              </div>

              {/* Text Meta info */}
              <div className="p-3 space-y-1 mt-2">
                <h3 className="text-sm font-bold text-white group-hover:text-primary transition truncate">
                  {prod.name}
                </h3>
                <p className="text-sm font-black text-white font-mono">
                  {formatIDR(prod.price)}
                </p>
                <div className="flex justify-between items-center pt-2 text-[10px] text-muted">
                  <span>Stock: {prod.stock > 0 ? `${prod.stock} Pcs` : 'Habis'}</span>
                  {prod.sizes.length > 0 && (
                    <span className="border border-white/10 rounded px-1 text-[8px] uppercase tracking-wide">
                      {prod.sizes.join(', ')}
                    </span>
                  )}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* --- LIGHTBOX MODAL FOR PRODUCT DETAILS --- */}
        <AnimatePresence>
          {selectedProduct && !showCheckout && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />

              {/* Lightbox box */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-primary/20 bg-[#0c0c0e] p-6 shadow-2xl glass-red flex flex-col md:flex-row gap-6"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-1.5 text-muted transition hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>

                {/* Left: Product Large Image */}
                <div className="flex-1 max-h-[30vh] md:max-h-[70vh] flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden border border-white/5">
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Right: Info details */}
                <div className="md:w-80 flex flex-col justify-between py-2 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                        {selectedProduct.category}
                      </span>
                      <h2 className="text-xl font-black text-white leading-snug">
                        {selectedProduct.name}
                      </h2>
                      <p className="text-xl font-mono font-black text-primary mt-1">{formatIDR(selectedProduct.price)}</p>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {selectedProduct.description}
                    </p>

                    {/* Stock level info */}
                    <p className="text-xs font-semibold text-muted">
                      Status Stock: {selectedProduct.stock > 0 ? (
                        <span className="text-emerald-400 font-bold">{selectedProduct.stock} Pcs Tersedia</span>
                      ) : (
                        <span className="text-rose-500 font-bold">Stok Habis</span>
                      )}
                    </p>

                    {selectedProduct.stock > 0 && (
                      <div className="space-y-4 pt-2 border-t border-white/5">
                        {/* Size Picker (If sizes exists) */}
                        {selectedProduct.sizes.length > 0 && selectedProduct.sizes[0] !== 'All Size' && (
                          <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Select Size</label>
                            <div className="flex gap-2">
                              {selectedProduct.sizes.map((size) => (
                                <button
                                  key={size}
                                  onClick={() => setSelectedSize(size)}
                                  className={`rounded-lg h-9 w-9 text-xs font-bold uppercase border transition ${
                                    selectedSize === size
                                      ? 'bg-primary border-primary text-white'
                                      : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quantity Counter selector */}
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Jumlah (Quantity)</label>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setOrderQty(prev => Math.max(1, prev - 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-neutral-400 hover:border-white/30 hover:text-white font-bold"
                            >
                              -
                            </button>
                            <span className="font-mono text-sm text-white font-bold">{orderQty}</span>
                            <button
                              onClick={() => setOrderQty(prev => Math.min(selectedProduct.stock, prev + 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-neutral-400 hover:border-white/30 hover:text-white font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Purchase Gated button */}
                  <div>
                    {selectedProduct.stock > 0 ? (
                      <button
                        onClick={handleOpenCheckout}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-primary-hover shadow-lg shadow-primary/25"
                      >
                        <ShoppingCart size={14} />
                        <span>Order Sekarang</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-800 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500 border border-white/5 cursor-not-allowed"
                      >
                        <span>Stok Habis</span>
                      </button>
                    )}
                    
                    {/* Guest Checkout Gate Notice */}
                    {!user.isLoggedIn && (
                      <p className="mt-2 text-center text-[10px] text-muted flex items-center justify-center gap-1">
                        <AlertCircle size={10} className="text-primary animate-pulse" />
                        <span>Hanya untuk member (silakan login)</span>
                      </p>
                    )}
                  </div>

                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- CHECKOUT MODAL WINDOW --- */}
        <AnimatePresence>
          {showCheckout && selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeCheckoutFlow}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/20 bg-[#0c0c0e]/95 p-8 shadow-2xl glass-red"
              >
                {/* Close Button */}
                <button
                  onClick={closeCheckoutFlow}
                  className="absolute top-4 right-4 rounded-full p-1 text-muted transition hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>

                {!orderSuccessId ? (
                  /* Form Checkout Entry */
                  <form onSubmit={handleConfirmPurchase} className="space-y-5">
                    <div className="text-center">
                      <span className="rounded bg-primary/10 border border-primary/20 py-0.5 px-2.5 text-[9px] font-black uppercase tracking-wider text-primary">
                        MANUAL CHECKOUT SHOP
                      </span>
                      <h3 className="text-xl font-black uppercase text-white mt-2 leading-snug">
                        Konfirmasi Order
                      </h3>
                    </div>

                    {/* Order summary card */}
                    <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-2">
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span className="font-semibold">{selectedProduct.name} ({selectedSize || 'All Size'})</span>
                        <span className="font-mono">x{orderQty}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold text-white">
                        <span>Total Bayar</span>
                        <span className="font-mono text-primary">{formatIDR(selectedProduct.price * orderQty)}</span>
                      </div>
                    </div>

                    {/* Bank Transfer Details Info */}
                    <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 space-y-3 glass-red text-xs">
                      <h4 className="font-bold text-white uppercase tracking-widest text-[10px]">Informasi Rekening Transfer</h4>
                      <p className="text-neutral-300 leading-relaxed">
                        Silakan lakukan pembayaran transfer bank sebesar <span className="font-mono font-bold text-white">{formatIDR(selectedProduct.price * orderQty)}</span> ke rekening berikut:
                      </p>
                      <div className="bg-black/60 rounded-xl p-3 border border-white/5 font-mono space-y-1">
                        <p className="text-[10px] text-muted uppercase">Bank Transfer</p>
                        <p className="text-sm font-bold text-white">BCA: 123-456-7890</p>
                        <p className="text-[10px] text-white/80">a/n PT Immortal Division Studio</p>
                      </div>
                    </div>

                    {checkoutError && (
                      <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3 text-xs text-rose-400">
                        {checkoutError}
                      </div>
                    )}

                    {/* Buyer Delivery Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Nama Penerima</label>
                        <input
                          type="text"
                          required
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                        />
                      </div>
                      
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">No. WhatsApp</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 628123456789"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-xs text-white outline-none focus:border-primary/50"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted">Alamat Lengkap Pengiriman</label>
                        <textarea
                          required
                          placeholder="Tulis alamat lengkap pengiriman paket beserta kode pos..."
                          value={buyerAddress}
                          onChange={(e) => setBuyerAddress(e.target.value)}
                          rows={2}
                          className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white outline-none focus:border-primary/50 resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingOrder}
                      className="w-full flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover active:scale-95"
                    >
                      <MessageSquare size={14} />
                      <span>Confirm & Chat WhatsApp</span>
                    </button>
                  </form>
                ) : (
                  /* Success Booking Screen */
                  <div className="text-center py-6 space-y-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                      <Check size={28} />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black uppercase tracking-wider text-white">ORDER RECORDED!</h3>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                        ID Pesanan Anda telah dicatat. Kami sedang membuka rujukan obrolan WhatsApp untuk memverifikasi bukti transfer dan alamat Anda.
                      </p>
                    </div>

                    {/* Ticket Reference Block */}
                    <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 text-center font-mono glass-red">
                      <p className="text-[10px] text-muted uppercase tracking-widest">ORDER TRANSACTION ID</p>
                      <p className="text-xl font-black text-white mt-1 tracking-wider">{orderSuccessId}</p>
                    </div>

                    <button
                      onClick={closeCheckoutFlow}
                      className="w-full rounded-xl bg-white/5 border border-white/10 py-3 font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
                    >
                      Kembali Belanja
                    </button>
                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
