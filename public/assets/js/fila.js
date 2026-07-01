'use strict';

const POLL_INTERVAL = 10000;
let pollTimer = null;

function horaFormatada(isoString) {
    return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function buildCard(pedido) {
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
            <button
                class="btn btn-iniciar btn-sm w-100 mt-1"
                data-id="${pedido.id}"
                onclick="iniciarPreparo(this)">
                <i class="fa-solid fa-fire me-1"></i>Iniciar preparo
            </button>
        </div>
    </div>`;
}

function atualizarTimestamps() {
    document.querySelectorAll('.timestamp[data-iso]').forEach(el => {
        el.textContent = horaFormatada(el.dataset.iso);
    });
}

async function carregarFila() {
    try {
        const res = await fetch(`${API_URL}api/pedidos?status=aguardando`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const pedidos = await res.json();

        const grid = document.getElementById('orders-grid');
        const emptyState = document.getElementById('empty-state');
        const badge = document.getElementById('badge-count');

        badge.textContent = pedidos.length;

        if (pedidos.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.remove('d-none');
            return;
        }

        emptyState.classList.add('d-none');

        const idsNovos = new Set(pedidos.map(p => String(p.id)));

        // Remove cards de pedidos que saíram da fila
        grid.querySelectorAll('[id^="card-"]').forEach(el => {
            const id = el.id.replace('card-', '');
            if (!idsNovos.has(id)) el.remove();
        });

        // Ordena do mais antigo para o mais novo (FIFO)
        const ordenados = [...pedidos].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        ordenados.forEach(pedido => {
            if (!document.getElementById(`card-${pedido.id}`)) {
                grid.insertAdjacentHTML('beforeend', buildCard(pedido));
            }
        });

        atualizarTimestamps();
    } catch (err) {
        console.error('Erro ao carregar fila:', err);
        showToast('Erro ao atualizar fila. Tentando novamente...', 'danger');
    }
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

        const card = document.getElementById(`card-${id}`);
        if (card) {
            card.style.transition = 'opacity .3s';
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                const grid = document.getElementById('orders-grid');
                const badge = document.getElementById('badge-count');
                const count = grid.querySelectorAll('[id^="card-"]').length;
                badge.textContent = count;
                if (count === 0) {
                    document.getElementById('empty-state').classList.remove('d-none');
                }
            }, 300);
        }
    } catch (err) {
        console.error('Erro ao iniciar preparo:', err);
        btn.disabled = false;
        btn.innerHTML = original;
        showToast('Erro ao iniciar preparo. Tente novamente.', 'danger');
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

function iniciarPolling() {
    clearInterval(pollTimer);
    pollTimer = setInterval(() => {
        carregarFila();
        atualizarTimestamps();
    }, POLL_INTERVAL);
}

carregarFila();
iniciarPolling();
