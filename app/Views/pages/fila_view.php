<?= $this->extend('templates/template') ?>

<?= $this->section('title') ?>Fila de Pedidos<?= $this->endSection() ?>

<?= $this->section('header-extra') ?>
<span class="order-time">Aguardando</span>
<span class="badge-count" id="badge-count">0</span>
<?= $this->endSection() ?>

<?= $this->section('styles') ?>
<style>
    .btn-iniciar {
        background-color: #fd7e14;
        border-color: #fd7e14;
        color: #fff;
        font-weight: 600;
    }

    .btn-iniciar:hover:not(:disabled) {
        background-color: #e8650a;
        border-color: #e8650a;
        color: #fff;
    }

    .btn-iniciar:disabled {
        opacity: .75;
        cursor: not-allowed;
    }
</style>
<?= $this->endSection() ?>

<?= $this->section('content') ?>

<div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3" id="orders-grid">
    <!-- Cards renderizados via fila.js -->
</div>

<div id="empty-state" class="d-none text-center py-5 empty-state">
    <i class="fa-solid fa-circle-check fa-4x text-success mb-3"></i>
    <h4 class="fw-semibold">Nenhum pedido aguardando</h4>
    <p class="mb-0">A fila está vazia no momento.</p>
</div>

<?= $this->endSection() ?>

<?= $this->section('scripts') ?>
<script src="<?= base_url('assets/js/fila.js') ?>"></script>
<?= $this->endSection() ?>
