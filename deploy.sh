images=()

zero_downtime_deploy() {
  service_name=$1
  service_port=$2
  old_container_id1=$(docker ps -f name=$service_name -q | tail -n1)
  old_container_id2=$(docker ps -f name=$service_name -q | head -n1)

  images+=($(docker inspect --format='{{.Image}}' $(docker ps -aq -f name=$service_name) | sed s/sha256://))

  if [ $( docker ps -f name=$service_name -q | wc -l ) -gt 0 ]; then
    # take the old container offline  
    docker stop $old_container_id1 1> /dev/null
    docker rm $old_container_id1 1> /dev/null

    # bring a new container online, running new code  
    # (nginx continues routing to the old container only)  
    docker compose up -d --scale $service_name=2 --no-recreate --no-build --pull always $service_name

    # wait for new container to be available  
    new_container_id=$(docker ps -f name=$service_name -q | head -n1)
    new_container_ip=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $new_container_id)
    curl --silent --include --retry-connrefused --retry 30 --retry-delay 1 --fail http://$new_container_ip:$service_port/ 1> /dev/null || exit 1

    echo "New container is online"

    docker exec nginx /usr/sbin/nginx -s reload 

    docker stop $old_container_id2 1> /dev/null
    docker rm $old_container_id2 1> /dev/null
  fi

  docker compose up -d --scale $service_name=2 --no-recreate --no-build --pull always $service_name
}

zero_downtime_deploy frontend 3000

for image in ${images[@]}; do
  docker image rm $image &> /dev/null || true
done


