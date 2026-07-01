<?= $this->extend('templates/template') ?>

<?= $this->section('title') ?>Em Preparo<?= $this->endSection() ?>

<?= $this->section('header-extra') ?>
<span class="order-time">Em preparo</span>
<span class="badge-count" id="badge-count" style="background-color:#0d6efd">0</span>
<?= $this->endSection() ?>

<?= $this->section('styles') ?>
<style>
    .order-card {
        border-top-color: #0d6efd;
    }

    .order-card.status-atrasado {
        border-top-color: #dc3545;
    }

    .btn-pronto {
        background-color: #0d6efd;
        border-color: #0d6efd;
        color: #fff;
        font-weight: 600;
    }

    .btn-pronto:hover:not(:disabled) {
        background-color: #0b5ed7;
        border-color: #0b5ed7;
        color: #fff;
    }

    .btn-pronto:disabled {
        opacity: .75;
        cursor: not-allowed;
    }

    .order-card.status-atrasado .btn-pronto {
        background-color: #dc3545;
        border-color: #dc3545;
    }

    .order-card.status-atrasado .btn-pronto:hover:not(:disabled) {
        background-color: #b02a37;
        border-color: #b02a37;
    }
</style>
<?= $this->endSection() ?>

<?= $this->section('content') ?>

<div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3" id="orders-grid">
    <!-- Cards renderizados via preparo.js -->
</div>

<div id="empty-state" class="d-none text-center py-5 empty-state">
    <i class="fa-solid fa-fire-burner fa-4x text-secondary mb-3"></i>
    <h4 class="fw-semibold">Nenhum pedido em preparo</h4>
    <p class="mb-0">Aguardando pedidos da fila.</p>
</div>

<?= $this->endSection() ?>

<?= $this->section('scripts') ?>
<script src="<?= base_url('assets/js/preparo.js') ?>"></script>
<?= $this->endSection() ?>
