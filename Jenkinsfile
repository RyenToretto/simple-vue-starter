def label = "worker-${UUID.randomUUID().toString()}"

def setFailure() {
    currentBuild.result = "FAILURE"
}

def getGitTag() {
     //return sh(returnStdout: true, script: "git describe --tags `git rev-list --tags --max-count=1`")
     return env.GIT_TAG
}

def runCIStep() {
    try{
        sh 'npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI'
    }
    catch(e) {
        setFailure()
    }
    finally {
        worktileBuildRecord(failOnError: true, overviewPattern: "^.*passing")
    }
}

def runDeploy() {
    def deployCmd = ""
    def releaseUrl = ""
    def releaseName = "release-${env.BUILD_ID}"
    def isTagged = false

    def deployEnv = env.RUN_ENV?.toLowerCase();
    sh "echo will deploy ${deployEnv}"

    switch(deployEnv) {
        case "beta":
            def tag = getGitTag()
            deployCmd = "wtctl --env GIT_TAG=${tag}"
            // deployCmd = "wtctl --env GIT_TAG=${tag}"
            releaseUrl = "https://web-beta.worktile.com"
            releaseName = "release-${tag}"
            isTagged = true
            break;
	case "template":
            def tag = getGitTag()
            deployCmd = "wtctl --env GIT_TAG=${tag}"
            releaseUrl = "https://web-beta.worktile.com"
            releaseName = "release-${tag}"
            isTagged = true
            break;
        case "alpha":
            deployCmd = "wtctl"
            releaseUrl = "http://yctech.worktile.live"
            break;
        case "rc":
            def tag = getGitTag()
            deployCmd = "wtctl --env GIT_TAG=${tag}"
            releaseUrl = "https://web-rc.worktile.com"
            releaseName = "release-${tag}"
            isTagged = true;
            break;
        case "prod":
            def tag = getGitTag()
            deployCmd = "wtctl --env GIT_TAG=${tag}"
            releaseName = "release-${tag}"
            isTagged = true
            releaseUrl = "https://web-prod.worktile.com"
            break;
        default:
            sh "echo What do you want, env.RUN_ENV = ${env.RUN_ENV} not in [beta, rc, prod, alpha]"
            setFailure();
    }

    if(deployCmd == "") {
        sh "echo deployCmd is empty, please check!!!"
        setFailure();
        return;
    }

    if(releaseUrl == "") {
        "echo releaseUrl is empty, please check!!!"
        setFailure();
        return;
    }

    try {
        container("wtctl") {
            echo "will execute ${deployCmd} and deploy to ${releaseUrl}"
            sh "${deployCmd}"
            status = "SUCCESS"
            message();
        }
    }
    catch(e) {
        status = "FAILURE"
        message();
        setFailure();
    }
    finally {
        worktileDeployRecord(
            failOnError: true,
            releaseName: releaseName,
            environmentName: "${deployEnv}",
            releaseURL: "${releaseUrl}",
            isTagged: isTagged
        );
    }
}

podTemplate(label: label, cloud: 'kubernetes',
    containers: [
        containerTemplate(name: 'node-chrome', image: 'harbor.pingcode.live/library/node-chrome:v2', alwaysPullImage: true, ttyEnabled: true, command: 'cat',resourceRequestCpu: '500m',resourceLimitCpu: '500m'),
        containerTemplate(name: 'wtctl', image: 'registry.cn-beijing.aliyuncs.com/worktile/wtctl:m1.0.0', alwaysPullImage: true, ttyEnabled: true, command: 'cat',resourceRequestCpu: '100m',resourceLimitCpu: '100m')
    ],
    volumes: [
        hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'),
        hostPathVolume(mountPath: '/tmp/cache', hostPath: '/data/cache/itsm-jenkins-vue'),
        hostPathVolume(mountPath: '/root/.npm', hostPath: '/data/cache/.npm'),
        hostPathVolume(mountPath: '/tmp/worktile.sh', hostPath: '/data/cache/worktile.sh'),
        hostPathVolume(mountPath: '/root/.ssh', hostPath: '/root/.ssh')
    ]
) {
    node(label) {
        def scmVars = checkout scm
        def branch = scmVars.GIT_BRANCH

        stage('Worktile CI/CD') {
            script {
                if(env.FOR_CI == "true") {
                    container('wtctl') {
                        sh 'wtctl'
                    }
					container('node-chrome') {
                        runCIStep();
                    }
                }
				else {
				    container('wtctl') {
                        runDeploy();
                    }
                }
            }
        }
    }
}
