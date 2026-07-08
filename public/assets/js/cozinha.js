'use strict';

const POLL_INTERVAL = 5000;
const ATRASO_MS = 5 * 60 * 1000;
let pollTimer = null;

function horaFormatada(isoString) {
    return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function isAtrasado(isoString) {
    return (Date.now() - new Date(isoString).getTime()) > ATRASO_MS;
}

function buildCardAguardando(pedido) {
    const itens = (pedido.itens || [])
        .map(i => `<li>${i.quantidade}&times; ${i.nome}</li>`)
        .join('');

    return `
    <div class="col" id="card-${pedido.id}">
        <div class="card order-card h-100 shadow-sm p-3 d-flex flex-column gap-2">
            <div>
                <div class="order-number">#${String(pedido.numero || pedido.id).padStart(3, '0')}</div>
                <div class="order-customer">${pedido.cliente || '—'}</div>
            </div>
            <ul class="order-items list-unstyled mb-0">${itens}</ul>
            <div class="order-time mt-auto">
                <i class="fa-regular fa-clock me-1"></i>
                <span class="timestamp" data-iso="${pedido.created_at}">${horaFormatada(pedido.created_at)}</span>
            </div>
            <button class="btn btn-iniciar btn-sm w-100 mt-1" data-id="${pedido.id}" onclick="iniciarPreparo(this)">
                <i class="fa-solid fa-fire me-1"></i>Iniciar preparo
            </button>
        </div>
    </div>`;
}

function buildCardPreparo(pedido) {
    const atrasado = isAtrasado(pedido.started_at || pedido.created_at);
    const statusClass = atrasado ? 'status-atrasado' : 'status-em_preparo';
    const labelAtrasado = atrasado
        ? '<span class="badge bg-danger ms-2" style="font-size:.7rem">Atrasado</span>'
        : '';
    const tsIso = pedido.started_at || pedido.created_at;
    const itens = (pedido.itens || [])
        .map(i => `<li>${i.quantidade}&times; ${i.nome}</li>`)
        .join('');

    return `
    <div class="col" id="card-${pedido.id}">
        <div class="card order-card ${statusClass} h-100 shadow-sm p-3 d-flex flex-column gap-2">
            <div>
                <div class="order-number">
                    #${String(pedido.numero || pedido.id).padStart(3, '0')}
                    ${labelAtrasado}
                </div>
                <div class="order-customer">${pedido.cliente || '—'}</div>
            </div>
            <ul class="order-items list-unstyled mb-0">${itens}</ul>
            <div class="order-time mt-auto">
                <i class="fa-regular fa-clock me-1"></i>
                <span class="timestamp" data-iso="${tsIso}">${horaFormatada(tsIso)}</span>
            </div>
            <button class="btn btn-pronto btn-sm w-100 mt-1" data-id="${pedido.id}" onclick="marcarPronto(this)">
                <i class="fa-solid fa-check me-1"></i>Pronto
            </button>
        </div>
    </div>`;
}

function atualizarTimestamps() {
    document.querySelectorAll('#grid-aguardando .timestamp[data-iso]').forEach(el => {
        el.textContent = horaFormatada(el.dataset.iso);
    });
}

function atualizarStatusPreparo() {
    document.querySelectorAll('#grid-preparo [id^="card-"]').forEach(cardCol => {
        const cardEl = cardCol.querySelector('.order-card');
        const tsEl = cardCol.querySelector('.timestamp[data-iso]');
        if (!tsEl) return;

        tsEl.textContent = horaFormatada(tsEl.dataset.iso);

        if (isAtrasado(tsEl.dataset.iso)) {
            cardEl.classList.add('status-atrasado');
            cardEl.classList.remove('status-em_preparo');
            if (!cardCol.querySelector('.badge')) {
                cardCol.querySelector('.order-number').insertAdjacentHTML('beforeend',
                    '<span class="badge bg-danger ms-2" style="font-size:.7rem">Atrasado</span>');
            }
        }
    });
}

async function carregarAguardando() {
    try {
        const res = await fetch(`${API_URL}api/pedidos?status=aguardando`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const pedidos = await res.json();

        const grid = document.getElementById('grid-aguardando');
        const emptyState = document.getElementById('empty-aguardando');
        document.getElementById('badge-aguardando').textContent = pedidos.length;

        if (pedidos.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.remove('d-none');
            return;
        }
        emptyState.classList.add('d-none');

        const idsNovos = new Set(pedidos.map(p => String(p.id)));
        grid.querySelectorAll('[id^="card-"]').forEach(el => {
            if (!idsNovos.has(el.id.replace('card-', ''))) el.remove();
        });

        [...pedidos]
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .forEach(pedido => {
                if (!document.getElementById(`card-${pedido.id}`)) {
                    grid.insertAdjacentHTML('beforeend', buildCardAguardando(pedido));
                }
            });
    } catch (err) {
        console.error('Erro ao carregar fila:', err);
        showToast('Erro ao atualizar fila. Tentando novamente...', 'danger');
    }
}

async function carregarPreparo() {
    try {
        const res = await fetch(`${API_URL}api/pedidos?status=em_preparo`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const pedidos = await res.json();

        const grid = document.getElementById('grid-preparo');
        const emptyState = document.getElementById('empty-preparo');
        document.getElementById('badge-preparo').textContent = pedidos.length;

        if (pedidos.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.remove('d-none');
            return;
        }
        emptyState.classList.add('d-none');

        const idsNovos = new Set(pedidos.map(p => String(p.id)));
        grid.querySelectorAll('[id^="card-"]').forEach(el => {
            if (!idsNovos.has(el.id.replace('card-', ''))) el.remove();
        });

        [...pedidos]
            .sort((a, b) => new Date(a.started_at || a.created_at) - new Date(b.started_at || b.created_at))
            .forEach(pedido => {
                if (!document.getElementById(`card-${pedido.id}`)) {
                    grid.insertAdjacentHTML('beforeend', buildCardPreparo(pedido));
                }
            });

        atualizarStatusPreparo();
    } catch (err) {
        console.error('Erro ao carregar preparo:', err);
        showToast('Erro ao atualizar pedidos em preparo. Tentando novamente...', 'danger');
    }
}

function removerCard(id, gridId, badgeId, emptyId) {
    const card = document.getElementById(`card-${id}`);
    if (!card) return;
    card.style.transition = 'opacity .3s';
    card.style.opacity = '0';
    setTimeout(() => {
        card.remove();
        const count = document.getElementById(gridId).querySelectorAll('[id^="card-"]').length;
        document.getElementById(badgeId).textContent = count;
        if (count === 0) document.getElementById(emptyId).classList.remove('d-none');
    }, 300);
}

async function iniciarPreparo(btn) {
    const id = btn.dataset.id;
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Aguarde...';

    try {
        const res = await fetch(`${API_URL}api/pedidos/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'em_preparo' }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        removerCard(id, 'grid-aguardando', 'badge-aguardando', 'empty-aguardando');
        await atualizar();
        iniciarPolling();
    } catch (err) {
        console.error('Erro ao iniciar preparo:', err);
        btn.disabled = false;
        btn.innerHTML = original;
        showToast('Erro ao iniciar preparo. Tente novamente.', 'danger');
    }
}

async function marcarPronto(btn) {
    const id = btn.dataset.id;
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Aguarde...';

    try {
        const res = await fetch(`${API_URL}api/pedidos/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'pronto' }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        removerCard(id, 'grid-preparo', 'badge-preparo', 'empty-preparo');
        await atualizar();
        iniciarPolling();
    } catch (err) {
        console.error('Erro ao marcar como pronto:', err);
        btn.disabled = false;
        btn.innerHTML = original;
        showToast('Erro ao marcar pedido como pronto. Tente novamente.', 'danger');
    }
}

function showToast(message, type = 'danger') {
    const container = document.getElementById('toast-container');
    const id = `toast-${Date.now()}`;
    container.insertAdjacentHTML('beforeend', `
        <div id="${id}" class="toast align-items-center text-bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>`);
    const el = document.getElementById(id);
    const toast = new bootstrap.Toast(el, { delay: 4000 });
    toast.show();
    el.addEventListener('hidden.bs.toast', () => el.remove());
}

async function atualizar() {
    await Promise.all([carregarAguardando(), carregarPreparo()]);
    atualizarTimestamps();
}

function iniciarPolling() {
    clearInterval(pollTimer);
    pollTimer = setInterval(atualizar, POLL_INTERVAL);
}

atualizar();
iniciarPolling();
