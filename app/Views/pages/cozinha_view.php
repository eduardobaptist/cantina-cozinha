<?= $this->extend('templates/template') ?>

<?= $this->section('title') ?>Cozinha<?= $this->endSection() ?>

<?= $this->section('styles') ?>
<style>
    body {
        display: flex;
        flex-direction: column;
        min-height: 100dvh;
        overflow: hidden;
    }

    main.container-fluid {
        flex: 1;
        padding: 0 !important;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .cozinha-layout {
        flex: 1;
        display: flex;
        overflow: hidden;
    }

    .cozinha-col {
        flex: 1;
        overflow-y: auto;
        min-width: 0;
    }

    .col-header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: #fff;
        font-size: .95rem;
        font-weight: 600;
        color: #212529;
    }

    #grid-preparo .order-card { border-top-color: #0d6efd; }
    #grid-preparo .order-card.status-atrasado { border-top-color: #dc3545; }
    #grid-preparo .order-card .order-number { color: #0d6efd; }
    #grid-preparo .order-card.status-atrasado .order-number { color: #dc3545; }

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

    .btn-iniciar:disabled { opacity: .75; cursor: not-allowed; }

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

    .btn-pronto:disabled { opacity: .75; cursor: not-allowed; }

    #grid-preparo .order-card.status-atrasado .btn-pronto {
        background-color: #dc3545;
        border-color: #dc3545;
    }

    #grid-preparo .order-card.status-atrasado .btn-pronto:hover:not(:disabled) {
        background-color: #b02a37;
        border-color: #b02a37;
    }
</style>
<?= $this->endSection() ?>

<?= $this->section('content') ?>
<div class="cozinha-layout">

    <div class="cozinha-col border-end border-2">
        <div class="col-header px-3 py-2 d-flex align-items-center gap-2" style="border-bottom: 2px solid #fd7e14;">
            <span class="badge-count" id="badge-aguardando">0</span>
            <span><i class="fa-solid fa-hourglass-half me-2" style="color:#fd7e14"></i>Aguardando</span>
        </div>
        <div class="p-3">
            <div class="row row-cols-1 row-cols-xl-2 g-3" id="grid-aguardando"></div>
            <div id="empty-aguardando" class="d-none text-center py-5 empty-state">
                <i class="fa-solid fa-circle-check fa-4x text-success mb-3"></i>
                <h4 class="fw-semibold">Nenhum pedido aguardando</h4>
                <p class="mb-0">A fila está vazia no momento.</p>
            </div>
        </div>
    </div>

    <div class="cozinha-col">
        <div class="col-header px-3 py-2 d-flex align-items-center gap-2" style="border-bottom: 2px solid #0d6efd;">
            <span class="badge-count" id="badge-preparo" style="background-color:#0d6efd">0</span>
            <span><i class="fa-solid fa-fire me-2" style="color:#0d6efd"></i>Em Preparo</span>
        </div>
        <div class="p-3">
            <div class="row row-cols-1 row-cols-xl-2 g-3" id="grid-preparo"></div>
            <div id="empty-preparo" class="d-none text-center py-5 empty-state">
                <i class="fa-solid fa-fire-burner fa-4x text-secondary mb-3"></i>
                <h4 class="fw-semibold">Nenhum pedido em preparo</h4>
                <p class="mb-0">Aguardando pedidos da fila.</p>
            </div>
        </div>
    </div>

</div>
<?= $this->endSection() ?>

<?= $this->section('scripts') ?>
<script src="<?= base_url('assets/js/cozinha.js') ?>"></script>
<?= $this->endSection() ?>
