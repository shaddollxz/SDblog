function EndWith() {
    str=$1
    if [ -z ${str##*$2} ]; then
        echo 1
    else
        echo 0
    fi
}

function StartWith() {
    str=$1
    if [ -z ${str%%*$2} ]; then
        echo 1
    else
        echo 0
    fi
}
