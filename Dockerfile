FROM rabbitmq:3-management

# Enable STOMP plugin
RUN rabbitmq-plugins enable --offline rabbitmq_stomp

# Optionally enable other plugins
RUN rabbitmq-plugins enable --offline rabbitmq_management
