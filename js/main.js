// variável global
var dataGrid = [];
// montando o data grid e os selects
let marcaLst = [];
let tipoLst = [];
// select de marcas e tipos
const marcaSelectEl = document.getElementById("marca");
const tipoSelectEl = document.getElementById("tipo");
const ordemSelecEl = document.getElementById("ordem");
// método de inicialização da página
init();

function init() {
  // coletando todos os dados
  getData().then((res) => {
    res.sort(sortingValuesStr(res, "rating", true));
    setGrid(res);
    dataGrid = res;
  });
}

// busca os dados na api (ou arquivo)
async function getData() {
  // const local = "data/products.json"
  const local = "http://makeup-api.herokuapp.com/api/v1/products.json";
  let data = await fetch(local);
  let jsonData = await data.json();
  return jsonData;
}

async function setGrid(data) {
  const gridTag = document.getElementById("grid");
  gridTag.innerHTML = "";
  data.forEach(async (element) => {
    //console.log(element.rating, element.name, element.id);
    // cria a div principal que irá mostrar o elemento
    const mainDiv = document.createElement("div");
    mainDiv.style.width = "220px";
    mainDiv.style.height = "380px";
    mainDiv.classList.add("card", "text-bg-light");
    mainDiv.style.margin = "10px";
    mainDiv.addEventListener("click", showModal);
    mainDiv.id = element.id;
    // div filha que irá ter outros elementos como título e imagem
    const childDiv = document.createElement("div");
    childDiv.classList.add("card-body");
    // título da maquiagem
    const title = document.createElement("span");
    title.classList.add("card-title", "fw-semibold");
    title.textContent = element.name;
    // div para imagem e título
    const divImgTit = document.createElement("div");
    divImgTit.appendChild(title);
    // marca
    const marca = document.createElement("span");
    marca.textContent = element.brand;
    marca.classList.add("badge", "text-bg-secondary");
    marca.style.marginRight = "8px";
    // preço
    const preco = document.createElement("span");
    preco.textContent = `R$ ${
      (element.price * 5).toFixed(2).replace(".", ",") || 0
    }`;
    preco.classList.add("badge", "text-bg-primary");
    //div para brand e preço
    const brandPreco = document.createElement("div");
    brandPreco.appendChild(marca);
    brandPreco.appendChild(preco);
    // anexando os elementos
    mainDiv.appendChild(childDiv);
    childDiv.appendChild(divImgTit);
    childDiv.appendChild(brandPreco);
    gridTag.appendChild(mainDiv);
    // imagem da maquiagem
    const img = document.createElement("img");
    await checkImg(element.image_link, img);
    img.classList.add("figure-img", "img-fluid", "rounded");
    divImgTit.appendChild(img);
    // criar os itens de dropdown (select)
    if (!marcaLst.includes(element.brand) && element.brand !== null) {
      marcaLst.push(element.brand);
      const opt = document.createElement("option");
      opt.value = element.brand;
      opt.textContent = element.brand;
      marcaSelectEl.appendChild(opt);
    }
    if (
      !tipoLst.includes(element.product_type) &&
      element.product_type !== null
    ) {
      tipoLst.push(element.product_type);
      const opt = document.createElement("option");
      opt.value = element.product_type;
      opt.textContent = element.product_type;
      tipoSelectEl.appendChild(opt);
    }
  });
}

// cheaca se a imagem está disponível ou colocar uma imagem default
async function checkImg(imgUrl, i) {
  await fetch(imgUrl, {
    method: "HEAD",
    mode: "cors",
  })
    .then((res) =>
      res.ok ? (i.src = res.url) : (i.src = "img/unavaliable.png")
    )
    .catch((err) => (i.src = "img/unavailable.png"));
}

// procura item pelo nome
const searchMakeUP = document.getElementById("searchMakeUP");
searchMakeUP.addEventListener("input", searchMakeUPFn);
function searchMakeUPFn() {
  const valueFilter = searchMakeUP.value;
  // dataGrid recebido na inicialização da página
  const newDataArr = dataGrid.filter((item) =>
    item.name.toLowerCase().includes(valueFilter.toLowerCase())
  );
  setGrid(newDataArr);
}

// preenche e mostra o modal com os detalhes da maquiagem
function showModal(evt) {
  const makeUpId = parseInt(evt.currentTarget.id);
  const makeUp = dataGrid.find((f) => f.id === makeUpId);
  // colocar as informações no modal
  const title = document.getElementById("titulo-mdl");
  title.textContent = makeUp.name;
  const imgMakeUp = document.getElementById("img-mdl");
  imgMakeUp.src = makeUp.image_link;
  // marca
  const marca = document.getElementById("brand-mdl");
  marca.textContent = makeUp.brand;
  // preço
  const preco = document.getElementById("price-mdl");
  preco.textContent = `R$ ${
    (makeUp.price * 5).toFixed(2).replace(".", ",") || 0
  }`;
  // detalhes da maquiagem
  const brandDtl = document.getElementById("brand-dtl-mdl");
  brandDtl.textContent = makeUp.brand;
  const priceDtl = document.getElementById("price-dtl-mdl");
  priceDtl.textContent = `R$ ${
    (makeUp.price * 5).toFixed(2).replace(".", ",") || 0
  }`;
  const ratinDtl = document.getElementById("rating-dtl-mdl");
  ratinDtl.textContent = makeUp.rating;
  const catDtl = document.getElementById("category-dtl-mdl");
  catDtl.textContent = makeUp.category || "";
  const prdTypeDtl = document.getElementById("prd-dtl-mdl");
  prdTypeDtl.textContent = makeUp.product_type;
  // mostrar o modal
  const modal = document.getElementById("modal");
  modal.classList.add("show");
  modal.style.display = "block";
}
// fechar o modal
function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("show");
  modal.style.display = "none";
}

// selecionar a marca de acordo com o troca de item no select
function marcaChange() {
  // dataGrid recebido na inicialização da página
  const newDataArr = dataGrid.filter(
    (item) => item.brand === marcaSelectEl.value
  );
  dataGrid = newDataArr;
  setGrid(newDataArr);
  marcaSelectEl.setAttribute("disabled", "disabled");
}

// selecionar o tipo de acordo com o troca de item no select
function tipoChange() {
  // dataGrid recebido na inicialização da página
  const newDataArr = dataGrid.filter(
    (item) => item.product_type === tipoSelectEl.value
  );
  dataGrid = newDataArr;
  setGrid(newDataArr);
  tipoSelectEl.setAttribute("disabled", "disabled");
}

// ordenar
function ordenar() {
  if (ordemSelecEl.value === "menor_preco") {
    dataGrid.sort(sortingValues(true, "price"));
    setGrid(dataGrid);
  } else if (ordemSelecEl.value === "maior_preco") {
    dataGrid.sort(sortingValues(false, "price"));
    setGrid(dataGrid);
  } else if (ordemSelecEl.value === "avaliacao") {
    dataGrid.sort(sortingValuesStr(dataGrid, "rating", true));
    setGrid(dataGrid);
  } else if (ordemSelecEl.value === "nome_a_z") {
    dataGrid.sort(sortingValuesStr(dataGrid, "name", false));
    setGrid(dataGrid);
  } else if (ordemSelecEl.value === "nome_z_a") {
    dataGrid.sort(sortingValuesStr(dataGrid, "name", true));
    setGrid(dataGrid);
  }
  ordemSelecEl.setAttribute("disabled", "disabled");
}

// limpar seleção
function limpar() {
  marcaSelectEl.value = null;
  marcaSelectEl.removeAttribute("disabled");
  tipoSelectEl.value = null;
  tipoSelectEl.removeAttribute("disabled");
  ordemSelecEl.value = null;
  ordemSelecEl.removeAttribute("disabled");
  init();
}

// função de ordenação de preço
function sortingValues(ascending, prpt) {
  return function (a, b) {
    a = parseInt(a[prpt]).toFixed(2);
    b = parseInt(b[prpt]).toFixed(2);
    if (a === b) {
      return 0;
    } else if (a === null || isNaN(a) || a == 0) {
      return 1;
    } else if (b === null || isNaN(b) || b == 0) {
      return -1;
    } else if (ascending) {
      return a - b;
    } else {
      return b - a;
    }
  };
}

// função de ordenação por nomes
function sortingValuesStr(data, prpt, ascending) {
  return function (a, b) {
    a = a[prpt];
    b = b[prpt];
    if (a === b) {
      return 0;
    } else if (a === null) {
      return 1;
    } else if (b === null) {
      return -1;
    } else if (ascending) {
      return a < b ? 1 : -1;
    } else {
      return a < b ? -1 : 1;
    }
  };
}
