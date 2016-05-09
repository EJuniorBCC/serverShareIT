#!/bin/sh
##################################
# Script para monitorar processo.#
##################################
# Para que a funÃ§Ã£o de e-mail funcione, vocÃª deverÃ¡ ter o SMTP ativo no servidor.

# Defina neste campo, o nome do processo a ser filtrado.
PROCESSO=node
# Intervalo que serÃ¡ feita a checagem (em segundos).
INTERVALO=10
while true; do
      # NÃºmero de cÃ³pias do processo rodando - ExplicaÃ§Ã£o.
      OCORRENCIAS=`ps ax | grep $PROCESSO | grep -v grep| wc -l`
      if [ $OCORRENCIAS -eq 0 ]; then
                 # Se o nÃºmero de processos rodando Ã© 0, executa novamente a aplicaÃ§Ã£o e notifica a Ã¡rea de TI - ExplicaÃ§Ã£o
				 # Caso sua aplicaÃ§Ã£o nÃ£o esteja no /etc/init.d/ altere o caminho de forma que lhe atenda.
                  nohup node server.js</dev/null &>/dev/null &

       fi
       # Aguarda o intervalo especificado na variÃ¡vel e executa novamente o script.
        sleep $INTERVALO
done
# Fim do Script