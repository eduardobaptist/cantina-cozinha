<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cantina (cozinha)</title>
    <link href="<?= base_url('assets/css/bootstrap.min.css') ?>" rel="stylesheet">
    <link rel="stylesheet" href="<?= base_url('assets/css/fontawesome.all.min.css') ?>">
    <style>
        body {
            background-color: #d8dce2;
        }

        .order-card {
            background-color: #fff;
            border: none;
            border-top: 4px solid #fd7e14;
            border-radius: .5rem;
        }

        .order-card.status-em_preparo { border-top-color: #0d6efd; }
        .order-card.status-atrasado   { border-top-color: #dc3545; }

        .order-number {
            font-size: 2rem;
            font-weight: 900;
            color: #fd7e14;
            line-height: 1;
        }

        .order-customer { font-size: .9rem; color: #6c757d; font-weight: 500; }
        .order-items    { font-size: .875rem; color: #212529; }
        .order-time     { font-size: .8rem; color: #6c757d; }

        .header-bar {
            background: #fff;
            border-bottom: 3px solid #fd7e14;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-bar h1 {
            font-size: 1.4rem;
            font-weight: 700;
            color: #212529;
        }

        .badge-count {
            background-color: #fd7e14;
            color: #fff;
            font-size: .85rem;
            border-radius: 999px;
            padding: .2em .65em;
            font-weight: 700;
        }

        .empty-state { color: #6c757d; }
    </style>
    <?= $this->renderSection('styles') ?>
    <script>
        const API_URL = "<?= rtrim(env('CANTINA_URL', 'http://localhost/cantina/'), '/') . '/' ?>";
    </script>
</head>

<body>

    <main class="container-fluid px-2 px-sm-3 px-md-4 py-3">
        <?= $this->renderSection('content') ?>
    </main>

    <!-- Toast container -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" id="toast-container" style="z-index:1100"></div>

    <script src="<?= base_url('assets/js/bootstrap.bundle.min.js') ?>"></script>
    <?= $this->renderSection('scripts') ?>
</body>

</html>
