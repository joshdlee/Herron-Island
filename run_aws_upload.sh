#!/bin/bash
/usr/local/bin/aws dynamodb batch-write-item --request-items file://July-2025-LowTides.json --profile prod 