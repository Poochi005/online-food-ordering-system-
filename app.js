const menu=[
{id:1,name:"Roasted Vegetable Bowl",category:"Mains",price:249,img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",desc:"Seasonal vegetables, grains and herb dressing."},
{id:2,name:"Classic Margherita",category:"Pizza",price:299,img:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80",desc:"Tomato, mozzarella and fresh basil."},
{id:3,name:"House Cheeseburger",category:"Mains",price:279,img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",desc:"Grilled patty, aged cheese and house sauce."},
{id:4,name:"Creamy Tomato Pasta",category:"Mains",price:269,img:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80",desc:"Pasta tossed in slow-cooked tomato sauce."},
{id:5,name:"Crispy Potato Wedges",category:"Sides",price:119,img:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80",desc:"Golden wedges with a house seasoning."},
{id:6,name:"Garden Side Salad",category:"Sides",price:149,img:"https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",desc:"Crisp greens, cucumber and lemon vinaigrette."},
{id:7,name:"Fresh Lemon Cooler",category:"Drinks",price:89,img:"https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=700&q=80",desc:"Fresh citrus, lightly sweetened and chilled."},
{id:8,name:"Cold Brew Coffee",category:"Drinks",price:129,img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80",desc:"Slow-steeped coffee served over ice."}
];
let cart=JSON.parse(localStorage.getItem("table-cart")||"{}"),filter="All";
const $=id=>document.getElementById(id),money=n=>"₹"+n.toLocaleString("en-IN");
function renderMenu(){const list=menu.filter(x=>filter==="All"||x.category===filter);$("products").innerHTML=list.map(x=>`<article class="product"><div class="product-img"><img loading="lazy" src="${x.img}" alt="${x.name}"></div><div class="product-info"><span class="category">${x.category}</span><h3>${x.name}</h3><p>${x.desc}</p><div class="product-bottom"><span class="price">${money(x.price)}</span><button class="add" data-add="${x.id}" aria-label="Add ${x.name}">+</button></div></div></article>`).join("")}
function renderCart(){const items=menu.filter(x=>cart[x.id]);const qty=Object.values(cart).reduce((a,b)=>a+b,0),total=items.reduce((s,x)=>s+x.price*cart[x.id],0);$("count").textContent=qty;$("subtotal").textContent=money(total);$("cart-lines").innerHTML=items.length?items.map(x=>`<div class="line-item"><div><strong>${x.name}</strong><small>${money(x.price)} each</small><div class="quantity"><button data-change="${x.id}" data-delta="-1">−</button><span>${cart[x.id]}</span><button data-change="${x.id}" data-delta="1">+</button></div></div><span class="line-total">${money(x.price*cart[x.id])}</span></div>`).join(""):'<div class="empty">Your order is empty.<br>Choose an item from the menu to begin.</div>';$("checkout").disabled=!items.length;localStorage.setItem("table-cart",JSON.stringify(cart))}
function notify(s){$("notice").textContent=s;$("notice").classList.add("show");setTimeout(()=>$("notice").classList.remove("show"),2600)}
function showCart(){ $("drawer").classList.add("visible");$("shade").classList.add("visible");$("drawer").setAttribute("aria-hidden","false")}
function hideCart(){$("drawer").classList.remove("visible");$("shade").classList.remove("visible");$("drawer").setAttribute("aria-hidden","true")}
$("filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderMenu()});
$("products").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=+b.dataset.add;cart[id]=(cart[id]||0)+1;renderCart();notify("Added to your order.")});
$("cart-lines").addEventListener("click",e=>{const b=e.target.closest("[data-change]");if(!b)return;const id=+b.dataset.change;cart[id]=(cart[id]||0)+ +b.dataset.delta;if(cart[id]<=0)delete cart[id];renderCart()});
$("open-cart").onclick=showCart;$("close-cart").onclick=hideCart;$("shade").onclick=hideCart;
document.addEventListener("keydown",e=>{if(e.key==="Escape")hideCart()});
$("checkout").onclick=()=>{hideCart();$("checkout-dialog").showModal()};
$("close-dialog").onclick=()=>$("checkout-dialog").close();
$("checkout-form").addEventListener("submit",e=>{e.preventDefault();const fd=new FormData(e.target),order={reference:"TT"+Date.now().toString().slice(-6),name:fd.get("name"),phone:fd.get("phone"),address:fd.get("address"),items:menu.filter(x=>cart[x.id]).map(x=>({name:x.name,quantity:cart[x.id],price:x.price})),total:menu.reduce((s,x)=>s+x.price*(cart[x.id]||0),0),createdAt:new Date().toISOString()};localStorage.setItem("table-last-order",JSON.stringify(order));cart={};renderCart();e.target.reset();$("checkout-dialog").close();notify("Demo order "+order.reference+" confirmed.")});
renderMenu();renderCart();
