function Error() {
    tput setaf 1
    echo $1
    tput setaf 7
}

function Success() {
    tput setaf 2
    echo $1
    tput setaf 7
}

function Warning() {
    tput setaf 3
    echo $1
    tput setaf 7
}
