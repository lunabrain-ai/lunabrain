# TODO breadchris this is a WIP

load('ext://restart_process', 'docker_build_with_restart')
load('ext://configmap', 'configmap_create')

deploy = os.getenv('DEPLOY', 'dev')

if deploy == 'docker-compose':
    local_resource(
      'lunabrain-compile',
      'CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o build/lunabrain cmd/main.go',
      deps=['go.mod', 'go.sum', 'pkg/', 'cmd/', 'gen/'])

    docker_compose('./docker-compose.yaml')
    docker_build(
        'ghcr.io/lunabrain/lunabrain',
        '.',
        dockerfile='Dockerfile',
        only=['build/lunabrain', 'Dockerfile', '.lunabrain.yaml'],
        live_update=[
            sync('build/lunabrain', '/app/build/lunabrain'),
            sync('config/lunabrain', '/app/config/lunabrain'),
            restart_container()
        ],
    )

    docker_build(
        'ghcr.io/lunabrain/lunabrain-python', 'python',
        live_update=[
            sync('./python', '/app/python/'),
            run('cd /app/ && pip install -r requirements.txt',
                trigger='./requirements.txt'),
            restart_container()
        ]
    )

if deploy == 'k8s':
    # TODO breadchris setup PVC for local dev with https://mauilion.dev/posts/kind-pvc/

    # TODO breadchris this should be for prod
    #docker_build(
    #    'lunabrain-image', '.',
    #    dockerfile='Dockerfile',
    #    only=['build/lunabrain', 'Dockerfile'],
    #)
    docker_build_with_restart(
        'ghcr.io/lunabrain/lunabrain',
        '.',
        dockerfile='Dockerfile',
        only=['build/lunabrain', 'Dockerfile', '.lunabrain.yaml'],
        entrypoint=['/app/build/lunabrain', 'api', 'serve'],
        live_update=[
            sync('build/lunabrain', '/app/build/lunabrain'),
        ],
    )

    docker_build(
        'ghcr.io/lunabrain/lunabrain-python', 'python',
        live_update=[
            sync('./python', '/app/python/'),
            run('cd /app/ && pip install -r requirements.txt',
                trigger='./requirements.txt'),
        ]
    )

    configmap_create(
        'lunabrain-config',
        from_file=['config.yaml=./.lunabrain.yaml'],
    )

    k8s_yaml('deploy/lunabrain.yaml')
    k8s_resource(
        'lunabrain',
        port_forwards=8080,
    )

    k8s_yaml('deploy/lunabrain-python.yaml')
    k8s_resource(
        'lunabrain-python',
        port_forwards=50051,
    )
